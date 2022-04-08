import { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '../lib/context';
import { firestore, auth, googleAuthProvider, googleSignInWithPopup, googleSignOut } from '../lib/firebase';
import { doc, getDoc, writeBatch } from 'firebase/firestore'
import debounce from 'lodash.debounce';

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
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const onChange = (e) => {
        // username must be between 3 and 15 characters long
        // containing only letters, numbers, underscore
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // check that username is >= 3 characters and passes regex format
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }
        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const checkUsername = useCallback(debounce(async (username) => {
        if (username.length >= 3) {
            const ref = doc(firestore, `usernames/${username}`);
            const { exists } = await getDoc(ref);
            console.log('Firestore read executed!');
            setIsValid(exists !== null);
            setLoading(false);
        }
    }, 500), []
    );

    const onSubmit = async (e) => {
        e.preventDefault();

        const userDoc = doc(firestore, `users/${user.uid}`);
        const usernameDoc = doc(firestore, `usernames/${formValue}`);

        const batch = writeBatch(firestore);
        try {
            batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
            batch.set(usernameDoc, { uid: user.uid });
            await batch.commit();
        } catch (error) {
            console.log("error with batch write");
        }
    };

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
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

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        <p></p>
    }
}
