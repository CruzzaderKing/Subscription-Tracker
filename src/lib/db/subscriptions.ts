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

export async function updateSubscription(uid: string, id: string, patch: Partial<Subscription>) {
  await updateDoc(doc(db, 'users', uid, 'subscriptions', id), patch as any);
}

export async function deleteSubscription(uid: string, id: string) {
  await deleteDoc(doc(db, 'users', uid, 'subscriptions', id));
}

export async function seedSubscriptions(uid: string) {
  const demo: Omit<Subscription, 'id'>[] = [
    {
      name: 'Netflix (Premium)',
      status: 'Активна',
      cycle: 'Ежемесячно',
      startDate: '15 сен 2025 г.',
      amount: 1199,
    },
    {
      name: 'Яндекс Плюс',
      status: 'Активна',
      cycle: 'Ежемесячно',
      startDate: '1 окт 2025 г.',
      amount: 299,
    },
    {
      name: 'Adobe CC',
      status: 'Отменена',
      cycle: 'Ежемесячно',
      startDate: '--------------',
      amount: 5290,
    },
  ];
  for (const item of demo) await addDoc(subsCol(uid), item);
}
