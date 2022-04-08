import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"
import { firestore, postToJSON, getUserWithUsername } from "../../lib/firebase";
import { getFirestore, addDoc, setDoc, doc, collection, onSnapshot, getDoc, getDocs, writeBatch, query as fs_query, where, limit, orderBy } from 'firebase/firestore'

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}

//run on the server every time the server is loaded
export async function getServerSideProps({ query }) {
    const { username } = query;
    const userDoc = await getUserWithUsername(username);

    // JSON serializable data
    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsRef = collection(firestore, 'posts')
        const postsQuery = fs_query(postsRef,
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
        );

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts },
    }
}