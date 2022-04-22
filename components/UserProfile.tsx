import Image from "next/image"

export default function UserProfile({ user }) {
    return (
        <div className="box-center">
            <div><Image src={user?.photoURL || '/default-profile.png'} alt="user photo" className="card-img-center" width="250" height="250" /></div>
            <p>
                <i>@{user?.username || 'anonUser'}</i>
            </p>
            <h1>{user?.displayName || 'Anonymous User'}</h1>
        </div>
    )
}