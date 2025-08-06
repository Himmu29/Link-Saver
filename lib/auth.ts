import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
