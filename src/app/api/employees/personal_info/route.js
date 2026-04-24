import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { userId, firstName, lastName, preferredName, personalEmail, gender, maritalStatus, dob, nationality, alternativeEmail, mobileNumber, alternativeNumber, emergencyContactName, emergencyNumber, relationToEmployee } = body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO employees (user_id, first_name, last_name, display_name, email, mobile_number, gender, marital_status, date_of_birth, nationality, alternative_email, alternative_phone, emergency_contact_name, emergency_phone, relation_to_employee, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, firstName, lastName, preferredName, personalEmail, mobileNumber, gender, maritalStatus, dob, nationality, alternativeEmail, alternativeNumber, emergencyContactName, emergencyNumber, relationToEmployee, new Date(), new Date()]
        );

        console.log('DB Result:', result);

        return NextResponse.json(
            { message: 'Saved Personal Info!', insertId: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}