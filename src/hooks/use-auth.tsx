
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
import { useRouter, usePathname } from 'next/navigation';
import { uploadFile } from '@/services/storage';

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

interface AuthContextType {
  user: User | null;
  userData: UserProfileData | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => void;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
  updateUserHostApplicationStatus: (status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  uploadFile: (file: File, path: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const noHeaderPages = ['/', '/reset-password', '/onboarding'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const createUserDocument = async (user: User): Promise<UserProfileData> => {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const username = user.email!.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    if (!userDocSnap.exists()) {
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
    }
    return userDocSnap.data() as UserProfileData;
  };

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserProfileData);
        } else {
          createUserDocument(user).then(setUserData);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error with onSnapshot:", error);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // This effect handles redirection logic.
    // It waits until loading is false to ensure both user and userData are settled.
    if (!loading) {
      const isAuthPage = noHeaderPages.includes(pathname);

      if (user) {
        // User is logged in
        if (userData?.onboardingComplete) {
          // If onboarded, they should NOT be on auth pages. Redirect to dashboard.
          if (isAuthPage) {
            router.push('/dashboard');
          }
        } else {
          // If not onboarded, they MUST be on the onboarding page.
          if (pathname !== '/onboarding') {
            router.push('/onboarding');
          }
        }
      } else {
        // User is not logged in. They should only be on auth pages.
        if (!isAuthPage) {
          router.push('/');
        }
      }
    }
  }, [user, userData, loading, pathname, router]);

  const signUp = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await createUserDocument(userCredential.user);
    return userCredential;
  }

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then(async (result) => {
        await createUserDocument(result.user);
        return result;
    });
  };

  const signInWithApple = () => {
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(auth, provider).then(async (result) => {
        await createUserDocument(result.user);
        return result;
    });
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
    
    // Update Firebase Auth profile if displayName or photoURL are present
    if (data.displayName || data.photoURL) {
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
    }

    // Update Firestore document
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
