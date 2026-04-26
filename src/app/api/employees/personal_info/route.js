import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
    const body = await request.json();

    const { userId, firstName, lastName, preferredName, personalEmail, gender, maritalStatus, dob, nationality, alternativeEmail, mobileNumber, alternativeNumber, emergencyContactName, emergencyNumber, relationToEmployee } = body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO employees (
        user_id, first_name, last_name, display_name, email, mobile_number, 
        gender, marital_status, date_of_birth, nationality, alternative_email, 
        alternative_phone, emergency_contact_name, emergency_phone, 
        relation_to_employee, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        display_name = VALUES(display_name),
        email = VALUES(email),
        mobile_number = VALUES(mobile_number),
        gender = VALUES(gender),
        marital_status = VALUES(marital_status),
        date_of_birth = VALUES(date_of_birth),
        nationality = VALUES(nationality),
        alternative_email = VALUES(alternative_email),
        alternative_phone = VALUES(alternative_phone),
        emergency_contact_name = VALUES(emergency_contact_name),
        emergency_phone = VALUES(emergency_phone),
        relation_to_employee = VALUES(relation_to_employee),
        updated_at = VALUES(updated_at)`,
            [
                userId, firstName, lastName, preferredName, personalEmail, mobileNumber,
                gender, maritalStatus, dob, nationality, alternativeEmail,
                alternativeNumber, emergencyContactName, emergencyNumber,
                relationToEmployee, new Date(), new Date()
            ]
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