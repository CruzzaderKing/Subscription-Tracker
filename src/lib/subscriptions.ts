// src/lib/subscriptions.ts
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export const subsCol = (uid: string) => collection(db, "users", uid, "subscriptions");

export async function listSubscriptions(uid: string) {
  const snap = await getDocs(subsCol(uid));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
}

export async function createSubscription(uid: string, data: any) {
  await addDoc(subsCol(uid), data);
}

export async function updateSubscription(uid: string, id: string, data: any) {
  await setDoc(doc(db, "users", uid, "subscriptions", id), data, { merge: true });
}

export async function removeSubscription(uid: string, id: string) {
  await deleteDoc(doc(db, "users", uid, "subscriptions", id));
}
