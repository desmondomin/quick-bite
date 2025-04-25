import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function Auth({user}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => alert("Signed up successful"))
        .catch((err) => alert(err.message));
    };

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(() => alert("Logged in successful"))
        .catch((err) => alert(err.message));
    };

    const logout = () => signOut(auth);

    return (
        <div className="p-4 bg-gray-100 rounded shadow max-w-md mx-auto my-4">
            {user ? (
                <div className="text-center">
                    <p className="mb-2">Logged in as: <strong>{user.email}</strong></p>
                    <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
                        Logout
                    </button>
                    </div>
            ) : (
                <>
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-2 w-full px-2 py-1 border rounded"

                    />
                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-2 w-full px-2 py-1 border rounded"
                    />
                    <div className="flex justify-between">
                        <button onClick={signIn} className="bg-blue-500 text-white px-3 py-1 rounded">Login</button>
                        <button onClick={signUp} className="bg-green-500 text-white px-3 py-1 rounded">Sign Up</button>

                    </div>
                </>
            )}
        </div>
    )
}