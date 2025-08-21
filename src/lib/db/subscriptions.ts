// src/lib/db/subscriptions.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import type { Subscription } from '../../types/subscription';
import { db } from '../firebase';

const subsCol = (uid: string) => collection(db, 'users', uid, 'subscriptions');

export function listenSubscriptions(uid: string, cb: (rows: Subscription[]) => void) {
  const q = query(subsCol(uid), orderBy('name'));
  return onSnapshot(q, (snap) => {
    const rows: Subscription[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Subscription, 'id'>),
    }));
    cb(rows);
  });
}

export async function createSubscription(uid: string, data: Omit<Subscription, 'id'>) {
  await addDoc(subsCol(uid), data);
}

export async function updateSubscription(
  uid: string,
  id: string,
  patch: Partial<Omit<Subscription, 'id'>>,
) {
  const subscriptionDocRef = doc(db, 'users', uid, 'subscriptions', id);
  await updateDoc(subscriptionDocRef, patch);
}

export async function deleteSubscription(uid: string, id: string) {
  await deleteDoc(doc(db, 'users', uid, 'subscriptions', id));
}
