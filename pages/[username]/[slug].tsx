
import { collection, collectionGroup, doc, getDoc, getDocs, query } from "firebase/firestore";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import Metatags from "../../components/Metatags";

// fetch data here on the server at build time
// in order to prerender this page in advance
export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);
    console.log("userDoc: " + userDoc.id);
    console.log("slug: " + slug);

    let post;
    let path;

    if (userDoc) {
        const postRef = doc(firestore, "users", userDoc.id, "posts", slug);
        const postSnapshot = await getDoc(postRef);
        post = postToJSON(postSnapshot);
        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    };
}


export async function getStaticPaths() {
    // Improve by using Admin SDK to select empty docs
    const collectionRef = collectionGroup(firestore, 'posts');
    const collectionQuery = query(collectionRef);
    const snapshot = await getDocs(collectionQuery);

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();

        return {
            params: { id: slug, username, slug },
        };
    });

    return {
        // must be in this format
        // paths: [
        //   { params: { username, slug }}
        // ],
        paths,
        fallback: 'blocking',
    };
}

export default function PostPage(props) {
    console.log("props.post");
    console.log(props.post);
    return (
        <main>
            <Metatags title={`${props.post.username}'s ${props.post.slug} post`} />
            <h1>Post Page</h1>
        </main>
    )
}