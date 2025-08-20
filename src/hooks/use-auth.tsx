
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
import { doc, setDoc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore"; 
import { useRouter, usePathname } from 'next/navigation';
import { uploadFile as uploadFileToStorage } from '@/services/storage';


interface UserProfileData {
  displayName?: string;
  photoURL?: string;
  bio?: string;
  bannerURL?: string;
  interests?: string[];
  likedEvents?: string[];
  savedEvents?: string[];
  hostApplicationStatus?: 'pending' | 'approved' | 'rejected' | 'none';
  onboardingComplete?: boolean;
  username?: string;
  eventsCount?: number;
  friendsCount?: number;
  followers?: number;
}
interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => void;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserHostApplicationStatus: (status: 'pending' | 'approved' | 'rejected' | 'none') => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
  uploadFile: (file: File, path: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
          setUserData(null);
          setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const username = user.email!.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    if (!userDocSnap.exists()) {
       const newUserData = {
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
        followers: [],
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
    return userDocSnap.data();
  };


  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserData(data);
          
          // --- Centralized Redirect Logic ---
          if (!loading) { // Only redirect after initial load
              const isPublicPage = ['/','/terms','/privacy','/imprint','/reset-password'].includes(pathname);
              const isOnboarding = pathname === '/onboarding';

              if (data.onboardingComplete && (isOnboarding || isPublicPage)) {
                  router.push('/dashboard');
              } else if (!data.onboardingComplete && !isOnboarding && !isPublicPage) {
                   router.push('/onboarding');
              }
          }

        } else {
          // This case should be rare, but we handle it
          createUserDocument(user).then(newUserData => {
             setUserData(newUserData);
             router.push('/onboarding');
          });
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
  }, [user, loading]);

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
  
  const updateUserProfile = async (data: Partial<UserProfileData>) => {
    if (!auth.currentUser) {
        throw new Error("No user is signed in to update profile.");
    }
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    
    // Also update the Firebase Auth profile if displayName or photoURL are changed
    const authUpdateData: { displayName?: string, photoURL?: string } = {};
    if (data.displayName) authUpdateData.displayName = data.displayName;
    if (data.photoURL) authUpdateData.photoURL = data.photoURL;

    if (Object.keys(authUpdateData).length > 0) {
        await updateProfile(auth.currentUser, authUpdateData);
    }
    // Update Firestore document
    await updateDoc(userDocRef, data);
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    return uploadFileToStorage(file, path);
  }

  const updateUserHostApplicationStatus = async (status: 'pending' | 'approved' | 'rejected' | 'none') => {
     if (!auth.currentUser) {
        throw new Error("No user is signed in to update profile.");
    }
    const userDocRef = doc(db, "users", auth.currentUser.uid);
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
    updateUserHostApplicationStatus,
    updateUserProfile,
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
