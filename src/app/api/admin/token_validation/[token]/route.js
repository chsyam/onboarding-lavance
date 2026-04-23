import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
    const { token } = await params;
    console.log('Fetching employee with token:', token);

    try {
        const [[user]] = await pool.execute(
            'SELECT * FROM users WHERE token = ?', [token]);

        if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({
            data: {
                ...user
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}