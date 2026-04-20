import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, bankName, routingNumber, accountNumber } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO payroll_tax_details (employee_id, bank_name, routing_number, account_number, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [employeeId, bankName, routingNumber, accountNumber, new Date(), new Date()]
        );

        return NextResponse.json(
            { message: 'Saved Payroll & Tax Details!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}