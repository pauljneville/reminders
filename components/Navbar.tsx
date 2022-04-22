import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth, googleSignOut } from '../lib/firebase';
import Image from 'next/image';

export default function Navbar() {
    const { user, username } = useContext(UserContext);
    const SignOutButton = () => {
        const signOut = async () => {
            googleSignOut(auth)
                .then(() => {
                    console.log('signout successful');
                })
                .catch((error) => {
                    console.error(error);
                })
        };
        return <button onClick={signOut}>Sign Out</button>
    }

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/" passHref={true}>
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>
                {username && (
                    <>
                        <li>
                            <Link href="/admin" passHref={true}>
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <><Image src={user?.photoURL || "/default-profile.png"} alt="user photo" width="50" height="50" /></>
                            </Link>
                        </li>
                        <li>
                            <SignOutButton />
                        </li>
                    </>
                )}
                {!username && (
                    <li>
                        <Link href="/enter" passHref={true}>
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}