import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { userId } = body;

    try {
        const [result] = await pool.execute(
            'update users set onboarding_status = ? where id = ?',
            ['submitted', userId]
        );

        return NextResponse.json(
            { message: 'Updated Token Status', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}