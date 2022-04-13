import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"
import { firestore, postToJSON, getUserWithUsername } from "../../lib/firebase";
import { getFirestore, addDoc, setDoc, doc, collection, collectionGroup, onSnapshot, getDoc, getDocs, writeBatch, query, where, limit, orderBy } from 'firebase/firestore'
import Metatags from "../../components/Metatags";

// run on the server every time the page is loaded
export async function getServerSideProps(context) {
    const { username } = context.query;
    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    // JSON serializable data
    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsRef = collectionGroup(firestore, 'posts')
        const postsQuery = query(postsRef,
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

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <Metatags title={`${user.displayName}'s posts`} />
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}
