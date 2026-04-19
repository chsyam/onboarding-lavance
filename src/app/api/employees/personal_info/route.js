import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();
    
    const { user_id, first_name, last_name, display_name, email, phone, gender, marital_status, date_of_birth, nationality } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO employees (user_id, first_name, last_name, display_name, email, phone, gender, marital_status, date_of_birth, nationality, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, first_name, last_name, display_name, email, phone, gender, marital_status, date_of_birth, nationality, new Date(), new Date()]
        );

        return NextResponse.json(
            { message: 'Saved Personal Info!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}