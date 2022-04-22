import { firestore, auth } from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { increment, writeBatch, collection, doc } from 'firebase/firestore';

// Allows user to heart or like a post
export default function HeartButton({ postRef }) {
    const yourHeartsARef = doc(postRef, 'hearts', auth?.currentUser?.uid);
    // Listen to heart document for currently logged in user
    const [heartDoc] = useDocument(yourHeartsARef);

    // Create a user-to-post relationship
    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        console.log("uid");
        console.log(uid);
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(yourHeartsARef, { uid });

        await batch.commit();
    };

    // Remove a user-to-post relationship
    const removeHeart = async () => {
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(yourHeartsARef);

        await batch.commit();
    };

    if (heartDoc?.exists) {
        return (<button onClick={removeHeart}>💔 Unheart</button>);
    } else {
        return (<button onClick={addHeart}>💗 Heart</button>);
    }
}
