import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, passport_url, ssn_url, work_permit_url, resume_url, latest_degree_certificate_url, experience_letter_url, previous_payslip_1_url, previous_payslip_2_url, previous_payslip_3_url, offer_acknowledgement_url, signed_nda_url } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO documents (employee_id, passport, ssn, work_permit, resume, latest_degree_certificate, experience_letter, previous_payslip_1, previous_payslip_2, previous_payslip_3, offer_acknowledgement, signed_nda, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employeeId, passport_url, ssn_url, work_permit_url, resume_url, latest_degree_certificate_url, experience_letter_url, previous_payslip_1_url, previous_payslip_2_url, previous_payslip_3_url, offer_acknowledgement_url, signed_nda_url, new Date(), new Date()]
        );

        return NextResponse.json(
            { message: 'Saved Documents URLs!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}