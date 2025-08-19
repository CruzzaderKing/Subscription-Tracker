import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";

export async function ensureUserProfile(u: User) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: u.displayName ?? "",
      email: u.email ?? "",
      photoURL: u.photoURL ?? "",
      createdAt: serverTimestamp(),
      plan: "free",
    });
  }
}
