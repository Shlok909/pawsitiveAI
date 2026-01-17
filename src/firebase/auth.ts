"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./client";
import type { SignUpFormValues, SignInFormValues } from "@/types/auth";
import { FirebaseError } from "firebase/app";

export async function signUp(
  data: SignUpFormValues
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: data.name,
  });

  return user;
}

export async function signIn(
  data: SignInFormValues
): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return userCredential.user;
  } catch (error) {
    // Re-throw the original error to be handled by the UI component
    throw error;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
