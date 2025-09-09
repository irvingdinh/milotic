import {
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from "firebase/auth";
import { atom } from "nanostores";

import { auth } from "../libs/firebase.ts";

export const authStore = atom<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    authStore.set({ user, loading: false });
  } else {
    signInAnonymously(auth).catch((error) => {
      console.error("Automatic anonymous sign-in failed:", error);
      authStore.set({ user: null, loading: false });
    });
  }
});
