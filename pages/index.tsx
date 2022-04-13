import Link from 'next/link'
import Loader from '../components/Loader'
import toast from 'react-hot-toast';

import { firestore, fromMillis, postToJSON } from '../lib/firebase';
import { query, collectionGroup, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PostFeed from '../components/PostFeed';

const LIMIT = 10;

// runs on the server every time the page is loaded
export async function getServerSideProps(context) {
  const postsQuery = query(
    collectionGroup(firestore, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const morePostsQuery = query(
      collectionGroup(firestore, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const morePosts = (await getDocs(morePostsQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(morePosts));
    setLoading(false);

    if (morePosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }

  useEffect(() => {
    if (posts.length < LIMIT) {
      setLoading(false);
      setPostsEnd(true);
    }
  }, []);

  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
      <Loader show={loading} />
      {postsEnd && 'You have reached the end!'}
    </main>
  )
}
