import { doc, onSnapshot } from 'firebase/firestore';

import { db } from '../firebase';

export type UserProfile = {
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export function listenUserProfile(uid: string, cb: (profile: UserProfile | null) => void) {
  const ref = doc(db, 'users', uid);
  return onSnapshot(ref, (snap) => {
    cb(snap.exists() ? (snap.data() as UserProfile) : null);
  });
}
