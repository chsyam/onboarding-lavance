import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, ssn, work_auth_status, visaType, visa_expiry_dt, passport_number, country_of_issue, passport_expiry_date, i94 } = body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO work_authorization (
        employee_id, ssn, work_authorization_status, visa_type, visa_expiry_date, 
        passport_number, country_of_issue, passport_expiry_date, i94, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        ssn = VALUES(ssn),
        work_authorization_status = VALUES(work_authorization_status),
        visa_type = VALUES(visa_type),
        visa_expiry_date = VALUES(visa_expiry_date),
        passport_number = VALUES(passport_number),
        country_of_issue = VALUES(country_of_issue),
        passport_expiry_date = VALUES(passport_expiry_date),
        i94 = VALUES(i94),
        updated_at = VALUES(updated_at)`,
            [
                employeeId, ssn, work_auth_status, visaType, visa_expiry_dt,
                passport_number, country_of_issue, passport_expiry_date, i94,
                new Date(), new Date()
            ]
        );

        return NextResponse.json(
            { message: 'Saved Work Authorization details!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}