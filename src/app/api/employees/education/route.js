import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, highestQualification, degreeName, specialization, university, graduatedYear, grade } = body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO education (
        employee_id, highest_qualification, degree_name, specialization, 
        university, graduated_year, grade, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        highest_qualification = VALUES(highest_qualification),
        degree_name = VALUES(degree_name),
        specialization = VALUES(specialization),
        university = VALUES(university),
        graduated_year = VALUES(graduated_year),
        grade = VALUES(grade),
        updated_at = VALUES(updated_at)`,
            [
                employeeId, highestQualification, degreeName, specialization,
                university, graduatedYear, grade, new Date(), new Date()
            ]
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