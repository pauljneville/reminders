import Link from "next/link";

export default function PostPreview({ post, admin = false }) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    return (
        <section className="card">
            <article>
                <div className="row-space-between">
                    <Link href={`/${post.username}/${post.slug}`}>
                        <h2>
                            <a>{post?.title}</a>
                            <a>{post?.subtitle}</a>
                        </h2>
                    </Link>
                    <Link href={`/${post.username}`}>
                        <a>
                            <strong>By @{post.username}</strong>
                        </a>
                    </Link>
                </div>
                <span>{post?.readyTime}</span>
                {post.dietaryies?.map((dietary) => (<span>{dietary}</span>))}
                <img src={post?.imageURL} alt={post?.ImageAlt} />
                <span>{post?.previewText}</span>
                <span>🐇 {post.followCount} following </span>
            </article>
        </section>
    );
}
