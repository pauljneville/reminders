import { collection, documentId, doc, limit, orderBy, query, serverTimestamp, where, setDoc } from "firebase/firestore";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { auth, firestore, postToJSON } from "../../lib/firebase";
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import styles from '../../styles/Admin.module.css';

const LIMIT = 10;

export default function AdminIndex({ }) {
    return (
        <main>
            <AuthCheck>
                <h1>Little Admin</h1>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    )
}

const PostList = () => {
    const userPostsRef = collection(firestore, "users", auth.currentUser.uid, "posts");
    const postsQuery = query(userPostsRef, orderBy('createdAt'), limit(LIMIT));
    const [querySnapshot] = useCollection(postsQuery);
    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <PostFeed posts={posts} admin />
    );
};

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(firestore, 'users', uid, 'posts', slug);

        // Tip: give all fields a default value here
        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await setDoc(ref, data);

        toast.success('Post created!')

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    };

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Article!"
                className={styles.input}
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    );
}