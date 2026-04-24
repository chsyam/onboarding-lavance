import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, residential_address, residential_city, residential_state, residential_zip_code, residential_country, is_address_same, permanent_address, permanent_city, permanent_state, permanent_zip_code, permanent_country } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO address (employee_id, residential_address, residential_city, residential_state, residential_zip_code, residential_country, is_address_same, permanent_address, permanent_city, permanent_state, permanent_zip_code, permanent_country, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employeeId, residential_address, residential_city, residential_state, residential_zip_code, residential_country, is_address_same, permanent_address, permanent_city, permanent_state, permanent_zip_code, permanent_country, new Date(), new Date()]
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