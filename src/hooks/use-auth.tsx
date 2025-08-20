
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
  updateUserProfile: (profileData: UserProfileData) => Promise<void>;
  updateUserProfileImage: (file: File, type: 'profile' | 'banner') => Promise<string>;
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

  const createUserDocument = async (user: User, onboardingComplete = false) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const username = user.email!.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    if (!userDocSnap.exists()) {
      // Create a new document in the 'users' collection with the user's uid
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
        onboardingComplete: onboardingComplete, // Set onboarding status
        interests: [],
        followers: 0,
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
           // Add redirection logic here
          if (data.onboardingComplete) {
            if (window.location.pathname === '/onboarding') {
                router.push('/dashboard');
            }
          } else {
            router.push('/onboarding');
          }
        } else {
          // If the doc doesn't exist for some reason, create it.
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
    await createUserDocument(userCredential.user, false); // onboardingComplete is false for new signups
    return userCredential;
  }

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then(async (result) => {
        // For social sign-ins, we can assume they have a name/photo and mark onboarding as complete
        await createUserDocument(result.user, true);
        return result;
    });
  };

  const signInWithApple = () => {
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(auth, provider).then(async (result) => {
        await createUserDocument(result.user, true);
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

  const updateUserProfile = async (profileData: UserProfileData) => {
    if (!auth.currentUser) {
        throw new Error("No user is signed in to update profile.");
    }
    
    // Data for Firebase Auth profile (only accepts displayName and photoURL)
    const authProfile: { displayName?: string, photoURL?: string } = {};
    if (profileData.displayName) authProfile.displayName = profileData.displayName;
    if (profileData.photoURL) authProfile.photoURL = profileData.photoURL;

    if (Object.keys(authProfile).length > 0) {
      await updateProfile(auth.currentUser, authProfile);
    }
    
    // Data for Firestore document (can include anything)
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    // Create a new object for Firestore that includes all provided data
    const firestoreData: { [key: string]: any } = {};
    for (const key in profileData) {
        if (profileData[key as keyof UserProfileData] !== undefined) {
            firestoreData[key] = profileData[key as keyof UserProfileData];
        }
    }
    
    if (Object.keys(firestoreData).length > 0) {
        await updateDoc(userDocRef, firestoreData);
    }
  }

  const updateUserHostApplicationStatus = async (status: 'pending' | 'approved' | 'rejected' | 'none') => {
     if (!auth.currentUser) {
        throw new Error("No user is signed in to update profile.");
    }
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, { hostApplicationStatus: status });
  }
  
  const updateUserProfileImage = async (file: File, type: 'profile' | 'banner'): Promise<string> => {
    if (!auth.currentUser) {
        throw new Error("No user is signed in to upload an image.");
    }
    const filePath = `${type}s/${auth.currentUser.uid}/${file.name}`;
    const downloadURL = await uploadFile(file, filePath);
    
    // Update the user's profile with the new image URL immediately
    const fieldToUpdate = type === 'profile' ? 'photoURL' : 'bannerURL';
    await updateUserProfile({ [fieldToUpdate]: downloadURL });
    
    return downloadURL;
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
    updateUserProfile,
    updateUserProfileImage,
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
