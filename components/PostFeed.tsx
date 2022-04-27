import PostPreview from "./PostPreview";

export default function PostFeed({ posts, admin = false }) {
    return (
        posts ? posts.map((post) => <PostPreview post={post} key={post.slug} admin={admin} />) : null
    );
}
