import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ulid } from "ulid";

export async function POST(request) {
    const body = await request.json();

    const {
        employee_id, first_name, last_name, email, role, bill_rate, job_type, started_dt
    } = body;

    const token = ulid()?.toLowerCase();

    try {
        const [result] = await pool.execute(
            'INSERT INTO users (employee_id, first_name, last_name, email, role, bill_rate, job_type, token, started_dt, onboarding_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employee_id, first_name, last_name, email, role, bill_rate, job_type, token, started_dt, 'not_started', new Date(), new Date()]
        );

        return NextResponse.json(
            { message: 'Employee created', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const [result] = await pool.execute(
            'SELECT * from users'
        );

        console.log(result);

        return NextResponse.json(
            { message: 'Employees List', result: result },
            { status: 200 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}