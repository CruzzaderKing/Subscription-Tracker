// src/lib/userProfile.ts
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export async function ensureUserProfile(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const base = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  if (!snap.exists()) {
    await setDoc(ref, { ...base, createdAt: serverTimestamp(), lastLoginAt: serverTimestamp() });
  } else {
    await setDoc(ref, { ...base, lastLoginAt: serverTimestamp() }, { merge: true });
  }
}
