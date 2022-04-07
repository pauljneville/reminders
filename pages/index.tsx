import Link from 'next/link'
import Loader from '../components/Loader'
import toast from 'react-hot-toast';

export default function Home() {
  return (
    <div>
      <Loader show />
      <Link href={{
        pathname: '/[username]',
        query: { username: 'mynamejeff' },
      }}>
        <a>Profile Jeff</a>
      </Link>
      <button onClick={() => toast.success('hello toast')}>
        Toast Me
      </button>
    </div>
  )
}
