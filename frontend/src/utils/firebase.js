import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "talentpulse-51c8b.firebaseapp.com",
  projectId: "talentpulse-51c8b",
  storageBucket: "talentpulse-51c8b.firebasestorage.app",
  messagingSenderId: "1029884409328",
  appId: "1:1029884409328:web:39ccfb2a5c4ecb3bf8d935"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const observeAuthState = (callback) => onAuthStateChanged(auth, callback);
const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return {
    photoURL: result.user.photoURL,
    token: await result.user.getIdToken(),
  };
};

export { app, observeAuthState, signInWithGoogle };