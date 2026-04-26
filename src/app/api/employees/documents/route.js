import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, passport_url, ssn_url, latest_degree_certificate_url, offer_acknowledgement_url, visa_url, void_check_url, i94_url, w4_url } = body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO documents (
        employee_id, passport, ssn, latest_degree_certificate, 
        offer_acknowledgement, visa, void_check, i94, w4, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        passport = VALUES(passport),
        ssn = VALUES(ssn),
        latest_degree_certificate = VALUES(latest_degree_certificate),
        offer_acknowledgement = VALUES(offer_acknowledgement),
        visa = VALUES(visa),
        void_check = VALUES(void_check),
        i94 = VALUES(i94),
        w4 = VALUES(w4),
        updated_at = VALUES(updated_at)`,
            [
                employeeId, passport_url, ssn_url, latest_degree_certificate_url,
                offer_acknowledgement_url, visa_url, void_check_url, i94_url, w4_url,
                new Date(), new Date()
            ]
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