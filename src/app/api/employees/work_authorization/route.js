import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, ssn, work_permit_number, work_auth_status, visaType, visa_expiry_dt, passport_number, country_of_issue, passport_expiry_date } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO work_authorization (employee_id, ssn, work_permit_number, work_authorization_status, visa_type, visa_expiry_date, passport_number, country_of_issue, passport_expiry_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employeeId, ssn, work_permit_number, work_auth_status, visaType, visa_expiry_dt, passport_number, country_of_issue, passport_expiry_date, new Date(), new Date()]
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