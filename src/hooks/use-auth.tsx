
'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  OAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore"; 
import { uploadFile } from '@/services/storage';
import { useRouter } from 'next/navigation';

interface UserProfileData {
  uid: string;
  email: string | null;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  bannerURL?: string;
  interests?: string[];
  likedEvents?: string[];
  savedEvents?: string[];
  isVerifiedHost?: boolean;
  hostApplicationStatus?: 'pending' | 'approved' | 'rejected' | 'none';
  onboardingComplete?: boolean;
  username?: string;
  eventsCount?: number;
  friendsCount?: number;
  followers?: number;
  following?: string[];
  createdAt: any;
}

interface AuthResult {
    user: User;
    userData: UserProfileData | null;
}

interface AuthContextType {
  user: User | null;
  userData: UserProfileData | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<AuthResult>;
  signIn: (email: string, pass: string) => Promise<AuthResult>;
  signOut: () => void;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithApple: () => Promise<AuthResult>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
  updateUserHostApplicationStatus: (status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  uploadFile: (file: File, path: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
        setLoading(true);
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                setUserData(doc.data() as UserProfileData);
            } else {
                 // This might happen briefly if the document hasn't been created yet.
                 // The createUserDocument function handles creation.
                setUserData(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error with onSnapshot listener:", error);
            setLoading(false);
        });
        return () => unsubscribeSnapshot();
    }
  }, [user]);

  const createUserDocument = async (user: User): Promise<UserProfileData> => {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data() as UserProfileData;
    }

    const username = user.email!.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const newUserData: UserProfileData = {
        uid: user.uid,
        email: user.email,
        username: username,
        displayName: user.displayName || username,
        photoURL: user.photoURL || '',
        bannerURL: '',
        bio: '',
        isVerifiedHost: false, 
        hostApplicationStatus: 'none',
        onboardingComplete: false,
        interests: [],
        followers: 0,
        following: [],
        friendsCount: 0,
        eventsCount: 0,
        likedEvents: [],
        savedEvents: [],
        createdAt: serverTimestamp()
    };
    await setDoc(userDocRef, newUserData);
    return newUserData;
  };


  const performAuthAction = async (authPromise: Promise<any>): Promise<AuthResult> => {
    const userCredential = await authPromise;
    const userData = await createUserDocument(userCredential.user);
    return { user: userCredential.user, userData };
  }

  const signUp = (email: string, pass: string) => {
    return performAuthAction(createUserWithEmailAndPassword(auth, email, pass));
  }

  const signIn = (email: string, pass: string) => {
    return performAuthAction(signInWithEmailAndPassword(auth, email, pass));
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return performAuthAction(signInWithPopup(auth, provider));
  };

  const signInWithApple = () => {
    const provider = new OAuthProvider('apple.com');
    return performAuthAction(signInWithPopup(auth, provider));
  };
  
  const sendPasswordReset = (email: string) => {
      return sendPasswordResetEmail(auth, email);
  }

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const updateUserProfileInAuthAndDb = async (data: Partial<UserProfileData>) => {
    if (!user) throw new Error("Not authenticated");
    
    if (data.displayName || data.photoURL) {
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
    }

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, data);
  };
  
  const updateUserHostApplicationStatus = async (status: 'pending' | 'approved' | 'rejected') => {
      if (!user) throw new Error("Not authenticated");
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { hostApplicationStatus: status });
  }

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithApple,
    sendPasswordReset,
    updateUserProfile: updateUserProfileInAuthAndDb,
    updateUserHostApplicationStatus,
    uploadFile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
