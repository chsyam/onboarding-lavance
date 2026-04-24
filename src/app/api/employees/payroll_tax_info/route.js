import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { employeeId, accountHolderName, bankName, routingNumber, accountNumber, accountType } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO payroll_tax_details (employee_id, account_holder_name, bank_name, routing_number, account_number, account_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [employeeId, accountHolderName, bankName, routingNumber, accountNumber, accountType, new Date(), new Date()]
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