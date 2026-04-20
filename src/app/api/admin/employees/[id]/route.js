import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
    const { id } = await params;
    console.log('Fetching employee with ID:', id);

    try {
        const [[user]] = await pool.execute(
            'SELECT * FROM users WHERE id = ?', [id]);
        const [[employee]] = await pool.execute(
            'SELECT * FROM employees WHERE user_id = ?', [id]);
        const [[address]] = await pool.execute(
            'SELECT * FROM address WHERE employee_id = ?', [employee?.id ?? 0]);
        const [[workAuth]] = await pool.execute(
            'SELECT * FROM work_authorization WHERE employee_id = ?', [id]);
        const [education] = await pool.execute(
            'SELECT * FROM education WHERE employee_id = ?', [id]);
        const [[payroll]] = await pool.execute(
            'SELECT * FROM payroll_tax_details WHERE employee_id = ?', [id]);
        const [[documents]] = await pool.execute(
            'SELECT * FROM documents WHERE employee_id = ?', [id]);

        if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({
            data: {
                ...user, ...employee,
                address, work_auth: workAuth,
                education, payroll, documents,
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const {
        first_name, last_name, phone, role, department,
        job_type, bill_rate, started_dt, gender,
        marital_status, date_of_birth, nationality,
    } = await request.json();

    try {
        // update users table
        await pool.execute(
            `UPDATE users SET role = ?, bill_rate = ?, job_type = ?,
             department = ?, started_dt = ?, updated_at = NOW() WHERE id = ?`,
            [role, bill_rate, job_type, department, started_dt, id]
        );

        // update employees table
        await pool.execute(
            `UPDATE employees SET
                first_name = ?, last_name = ?,
                display_name = ?, phone = ?,
                gender = ?, marital_status = ?,
                date_of_birth = ?, nationality = ?,
                updated_at = NOW()
             WHERE user_id = ?`,
            [
                first_name, last_name,
                `${first_name} ${last_name}`,
                phone, gender, marital_status,
                date_of_birth || null, nationality, id,
            ]
        );

        return NextResponse.json({ message: 'Employee updated!' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}