// app/components/MyForm.jsx
'use client';
import { useState } from 'react';

export default function MyForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
        });

        const data = await res.json();
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <button type="submit">Save</button>
        </form>
    );
}