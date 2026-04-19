import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();
    const { name, email } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );

        return NextResponse.json(
            { message: 'Saved!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}