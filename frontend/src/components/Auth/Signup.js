import React, { useState } from 'react';
import { handleSignup } from '../../services/auth';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleSignup({ username, email, password });
            window.location.reload(); // Reload after successful signup
        } catch (err) {
            setError('Signup failed. Try again.');
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Signup</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Signup;
