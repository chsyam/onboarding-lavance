import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, residential_address, residential_city, residential_state, residential_zip_code, residential_country, is_address_same, permanent_address, permanent_city, permanent_state, permanent_zip_code, permanent_country } = body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO address (
        employee_id, residential_address, residential_city, residential_state, 
        residential_zip_code, residential_country, is_address_same, 
        permenant_address, permanent_city, permanent_state, 
        permanent_zip_code, permanent_country, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        residential_address = VALUES(residential_address),
        residential_city = VALUES(residential_city),
        residential_state = VALUES(residential_state),
        residential_zip_code = VALUES(residential_zip_code),
        residential_country = VALUES(residential_country),
        is_address_same = VALUES(is_address_same),
        permenant_address = VALUES(permenant_address),
        permanent_city = VALUES(permanent_city),
        permanent_state = VALUES(permanent_state),
        permanent_zip_code = VALUES(permanent_zip_code),
        permanent_country = VALUES(permanent_country),
        updated_at = VALUES(updated_at)`,
            [
                employeeId, residential_address, residential_city, residential_state,
                residential_zip_code, residential_country, is_address_same,
                permanent_address, permanent_city, permanent_state,
                permanent_zip_code, permanent_country, new Date(), new Date()
            ]
        );

        return NextResponse.json(
            { message: 'Saved Address details!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}