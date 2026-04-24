import { NextResponse } from "next/server";
import resend from "@/lib/resend";

export async function POST(request) {
    try {
        const {
            candidateEmail,
            candidateName,
        } = await request.json();

        if (!candidateEmail || !candidateName) {
            return NextResponse.json(
                { error: "Missing required fields: candidateEmail, candidateName" },
                { status: 400 }
            );
        }


        const { data, error } = await resend.emails.send({
            from: `HR Lavance LLC <${process.env.FROM_EMAIL}>`,
            to: [candidateEmail],
            cc: ["sri@lavancegroup.com"],
            subject: `Your onboarding details have been submitted successfully`,
            template: {
                id: "onboarding-details-submission",
                variables: {
                    EMPLOYEE_NAME: candidateName,
                },
            },
        });

        if (error) {
            console.error("[send-invite] Resend error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`[send-invite] Sent to ${candidateEmail}, id: ${data.id}`);

        return NextResponse.json({
            success: true,
            id: data.id,
        });

    } catch (err) {
        console.error("[send-invite] Unexpected error:", err);
        return NextResponse.json(
            { error: "Failed to send invitation email." },
            { status: 500 }
        );
    }
}