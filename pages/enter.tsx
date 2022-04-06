import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth, googleAuthProvider, googleSignInWithPopup, googleSignOut } from '../lib/firebase';

export default function EnterPage(props) {
    const { user, username } = useContext(UserContext);

    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />

    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />
            }
        </main>
    )
}

const SignInButton = () => {
    const signIn = async () => {
        googleSignInWithPopup(auth, googleAuthProvider)
            .then((user) => {
                console.log(user);
            })
            .catch((error) => {
                console.error(error);
            })
    };
    return (
        <button className="btn-google" onClick={signIn}>
            <img src={'./google.png'} /> Sign in with Google
        </button>
    );
}

const UsernameForm = () => {
    return <h1>userform</h1>
}

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
