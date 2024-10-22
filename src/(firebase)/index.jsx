// Import the functions you need from the SDKs you need
import {getApp, getApps, initializeApp} from "firebase/app";
import {getAnalytics, isSupported} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2yaB4j2g-GlDGhUUMaFYnonIxuVHEOd0",
  authDomain: "suomen-ilmailuliito.firebaseapp.com",
  projectId: "suomen-ilmailuliito",
  storageBucket: "suomen-ilmailuliito.appspot.com",
  messagingSenderId: "1024518890397",
  appId: "1:1024518890397:web:b18f586f282218ce130574"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Initialize Analytics
const analytics = (async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    return supported ? getAnalytics(app) : null;
  }
  return null;
})();

export { app, firestore, storage, auth, analytics };