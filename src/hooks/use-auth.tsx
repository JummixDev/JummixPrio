
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
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/services/storage';


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
  completeOnboarding: (data: { displayName: string; bio?: string; interests?: string; imageFile?: File | null; }) => Promise<void>;
  updateUserHostApplicationStatus: (status: 'pending' | 'approved' | 'rejected' | 'none') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true); // Start loading when auth state changes
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
    }
  };


  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserData(data);

          const currentPath = window.location.pathname;
          
          if (data.onboardingComplete) {
            if (currentPath === '/onboarding' || currentPath === '/') {
                router.push('/dashboard');
            }
          } else {
             if (currentPath !== '/onboarding') {
                router.push('/onboarding');
            }
          }
        } else {
          createUserDocument(user);
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
  }, [user, router]);

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

  const updateUserHostApplicationStatus = async (status: 'pending' | 'approved' | 'rejected' | 'none') => {
     if (!auth.currentUser) {
        throw new Error("No user is signed in to update profile.");
    }
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, { hostApplicationStatus: status });
  }
  
  const completeOnboarding = async (data: { displayName: string; bio?: string; interests?: string; imageFile?: File | null; }) => {
    if (!auth.currentUser) {
      throw new Error("No user is signed in.");
    }
  
    let photoURL = userData?.photoURL || '';
  
    if (data.imageFile) {
      const filePath = `profile-pictures/${auth.currentUser.uid}/${data.imageFile.name}`;
      photoURL = await uploadFile(data.imageFile, filePath);
    }
  
    // This was the missing validation step. Onboarding cannot complete without a picture.
    if (!photoURL) {
      throw new Error("A profile picture is required to complete onboarding.");
    }
  
    // Update the Firebase Auth profile
    await updateProfile(auth.currentUser, {
      displayName: data.displayName,
      photoURL: photoURL,
    });
  
    // Now, update the Firestore document with all data at once.
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      displayName: data.displayName,
      photoURL: photoURL,
      bio: data.bio || '',
      interests: data.interests?.split(',').map(i => i.trim()).filter(Boolean) || [],
      onboardingComplete: true, // This is the final step
    });
  };


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
    completeOnboarding,
    updateUserHostApplicationStatus
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

    