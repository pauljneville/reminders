import Link from 'next/link';
import Image from 'next/image';
import birthdayShiba from '../public/birthday-shiba.gif';
import Metatags from '../components/Metatags';

export default function Custom404() {
    return (
        <main>
            <Metatags title="404 Not Found" />
            <h1>404 - That page does not seem to exist...</h1>
            <Image src={birthdayShiba} alt="birthday shiba inu" />
            <Link href="/">
                <button className="btn-blue">Go home</button>
            </Link>
        </main>
    );
}