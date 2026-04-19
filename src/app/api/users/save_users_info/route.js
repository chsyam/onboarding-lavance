import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { email, user_role, token, started_dt } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO users (email, role, token, started_dt, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [email, user_role, token, started_dt, new Date(), new Date()]
        );

        return NextResponse.json(
            { message: 'Saved User Info!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}