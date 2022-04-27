import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

// UI component for main post content
export default function PostContent({ post }) {
    const createdAt = typeof post?.updatedAt === 'number' ? new Date(post.updatedAt) : post.updatedAt.toDate();
    const updatedAtDate = moment(createdAt.toISOString());

    return (
        <section className="card">
            <article>
                <h1>{post?.title}</h1>
                <ReactMarkdown>{post?.content}</ReactMarkdown>
                <span className="text-sm">
                    By{' '}
                    <Link href={`/${post.username}/`}>
                        <a className="text-info">@{post.username}</a>
                    </Link>
                    {' '}
                    (Updated on {updatedAtDate.format("D MMMM YYYY")})
                </span>
            </article>
        </section>
    );
}