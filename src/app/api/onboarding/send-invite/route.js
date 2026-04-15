import { NextResponse } from "next/server";
import resend from "@/lib/resend";

export async function POST(request) {
    try {
        const {
            candidateEmail,
            candidateName,
            jobTitle,
            startDate,
            token,
        } = await request.json();

        if (!candidateEmail || !candidateName || !token) {
            return NextResponse.json(
                { error: "Missing required fields: candidateEmail, candidateName, token" },
                { status: 400 }
            );
        }

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        const expiryDate = expiry.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const formLink = `${process.env.APP_URL}?token=${token}`;

        const formattedStart = startDate
            ? new Date(startDate).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
            })
            : "To be confirmed";

        const { data, error } = await resend.emails.send({
            from: `HR Lavance LLC <${process.env.FROM_EMAIL}>`,
            to: [candidateEmail],
            cc: ["19131a0543@gvpce.ac.in"],
            subject: `Welcome to Lavance LLC - Onboarding details`,
            template: {
                id: "onboarding-template",
                variables: {
                    EMPLOYEE_NAME: candidateName,
                    ROLE: jobTitle,
                    START_DATE: formattedStart,
                    ONBOARDING_LINK: formLink,
                    HR_EMAIL: process.env.NEXT_PUBLIC_HR_EMAIL,
                    EXPIRY_DATE: expiryDate,
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
            expiryDate,
        });

    } catch (err) {
        console.error("[send-invite] Unexpected error:", err);
        return NextResponse.json(
            { error: "Failed to send invitation email." },
            { status: 500 }
        );
    }
}