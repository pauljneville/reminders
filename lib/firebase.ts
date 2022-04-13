import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore, addDoc, setDoc, doc, collection, onSnapshot, getDoc, getDocs, writeBatch, query, where, limit, Timestamp } from 'firebase/firestore'
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

// export const addDoc = fs_addDoc;
// export const setDoc = fs_setDoc;
// export const doc = fs_doc;
// export const collection = fs_collection;
// export const onSnapshot = fs_onSnapshot;
// export const getDoc = fs_getDoc;
// export const writeBatch = fs_writeBatch;

/**
 * Gets a users/{uid} document by username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('username', '==', username), limit(1));
    const snapshot = await getDocs(q);
    const userDoc = snapshot.docs[0];
    return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}

export const fromMillis = Timestamp.fromMillis;