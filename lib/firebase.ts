import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore, addDoc, setDoc, doc, collection, onSnapshot } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCbyIN8ExXr4aLtuxOi5V5nRJcdeeFQ_DM",
    authDomain: "reminders-9548f.firebaseapp.com",
    projectId: "reminders-9548f",
    storageBucket: "reminders-9548f.appspot.com",
    messagingSenderId: "530799434663",
    appId: "1:530799434663:web:27691ab3a29242d235b482",
    measurementId: "G-T569SFGKK6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const googleSignInWithPopup = signInWithPopup;
export const googleSignOut = signOut;
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export const fs_addDoc = addDoc;
export const fs_setDoc = setDoc;
export const fs_doc = doc;
export const fs_collection = collection;
export const fs_onSnapshot = onSnapshot;