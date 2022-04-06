
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, fs_addDoc, fs_collection, fs_doc, fs_setDoc, fs_onSnapshot } from './firebase';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe;

        if (user) {
            const docRef = fs_doc(firestore, 'users', user.uid);
            // onSnapshot callback runs everytime the document is updated
            unsubscribe = fs_onSnapshot(docRef, (doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, username };
}