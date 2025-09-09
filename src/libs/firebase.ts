import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpvwRvdPUel2oq6rS6IJIpTprU28EwiQA",
  authDomain: "irvingdotdev.firebaseapp.com",
  projectId: "irvingdotdev",
  storageBucket: "irvingdotdev.firebasestorage.app",
  messagingSenderId: "287400392622",
  appId: "1:287400392622:web:53d30f2514fda55f7efa3f",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
