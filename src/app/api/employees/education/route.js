import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, highestQualification, degreeName, specialization, university, graduatedYear, grade } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO education (employee_id, highest_qualification, degree_name, specialization, university, graduated_year, grade, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employeeId, highestQualification, degreeName, specialization, university, graduatedYear, grade, new Date(), new Date()]
        );

        return NextResponse.json(
            { message: 'Saved Education details!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}