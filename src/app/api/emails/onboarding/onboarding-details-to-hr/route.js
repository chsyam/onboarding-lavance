import { NextResponse } from "next/server";
import resend from "@/lib/resend";

export async function POST(request) {
    try {
        const {
            onboarding_form,
            employeeId
        } = await request.json();

        if (!onboarding_form || !employeeId) {
            return NextResponse.json(
                { error: "Missing required fields: onboarding_form, employeeId" },
                { status: 400 }
            );
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Employee Onboarding Details</title>
            </head>

            <body style="margin:0;padding:0;background:#f4f6f5;font-family:'Inter',Arial,sans-serif;color:#1a2e2a;">

                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f5;padding:40px 16px;">
                    <tr>
                        <td align="center">
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;">

                                <!-- Header -->
                                <tr>
                                    <td style="background:#2d6a5e;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
                                        <p
                                            style="margin:0 0 6px;font-size:11px;font-weight:700;color:#a8d5cb;text-transform:uppercase;letter-spacing:1.2px;">
                                            New Employee Onboarding</p>
                                        <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                                            Onboarding Details Submitted</h1>
                                    </td>
                                </tr>

                                <!-- Intro Banner -->
                                <tr>
                                    <td
                                        style="background:#f0f5f4;border:1px solid #c6d9d5;border-top:none;padding:16px 40px;font-size:13px;color:#2d6a5e;font-weight:500;line-height:1.6;">
                                        A new employee has completed their onboarding form. Please review the details below and take
                                        any necessary action.
                                    </td>
                                </tr>

                                <!-- Card Body -->
                                <tr>
                                    <td
                                        style="background:#ffffff;border:1px solid #e2e8e6;border-top:none;border-radius:0 0 12px 12px;padding:36px 40px;">

                                        <!-- Employee ID Badge -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                            <tr>
                                                <td
                                                    style="background:#f0f5f4;border:1px solid #c6d9d5;border-radius:8px;padding:14px 20px;">
                                                    <span
                                                        style="font-size:11px;font-weight:700;color:#2d6a5e;text-transform:uppercase;letter-spacing:0.8px;">Employee
                                                        ID</span>
                                                    <p
                                                        style="margin:4px 0 0;font-size:20px;font-weight:700;color:#1a2e2a;letter-spacing:1px;">
                                                        ${employeeId}</p>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- PERSONAL INFORMATION -->
                                        <p
                                            style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2d6a5e;text-transform:uppercase;letter-spacing:0.8px;">
                                            Personal Information</p>

                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;width:200px;">
                                                    First Name</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.firstName || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Last Name
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.lastName || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Preferred
                                                    Name</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.preferredName || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Date of
                                                    Birth</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.dob || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Gender</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.gender || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Nationality
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.nationality || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Marital
                                                    Status</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.maritalStatus || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Personal
                                                    Email</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.personalEmail || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Alternative
                                                    Email</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.alternativeEmail || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Mobile
                                                    Number</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.mobileNumber || ""}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Alternative
                                                    Mobile</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.alternativeNumber || ""}</td>
                                            </tr>
                                        </table>

                                        <!-- Divider -->
                                        <div style="border-top:1px solid #e2e8e6;margin:24px 0;"></div>

                                        <!-- EMERGENCY CONTACT -->
                                        <p
                                            style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2d6a5e;text-transform:uppercase;letter-spacing:0.8px;">
                                            Emergency Contact</p>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;width:200px;">
                                                    Contact Name</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.emergencyContactName || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Contact
                                                    Number</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.emergencyNumber || ""}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Relationship
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.relationToEmployee || ""}</td>
                                            </tr>
                                        </table>

                                        <!-- Divider -->
                                        <div style="border-top:1px solid #e2e8e6;margin:24px 0;"></div>

                                        <!-- ADDRESSES -->
                                        <p
                                            style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2d6a5e;text-transform:uppercase;letter-spacing:0.8px;">
                                            Addresses</p>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                                            <tr>
                                                <td colspan="2"
                                                    style="padding:4px 0 8px;font-size:12px;font-weight:600;color:#6b8f87;text-transform:uppercase;letter-spacing:0.5px;">
                                                    Current / Residential</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;width:200px;">
                                                    Address</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.residential_address || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">City</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.residential_city || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">State</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.residential_state || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">ZIP Code
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.residential_zip_code || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Country</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.residential_country || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Is
                                                    Residential Address Same as Permanent?</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.is_address_same ? "Same" : "Different" || ""}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2"
                                                    style="padding:16px 0 8px;font-size:12px;font-weight:600;color:#6b8f87;text-transform:uppercase;letter-spacing:0.5px;">
                                                    Permanent</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Address</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.permanent_address || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">City</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.permanent_city || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">State</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.permanent_state || ""}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">ZIP Code
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.permanent_zip_code || ""}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Country</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.permanent_country || ""}</td>
                                            </tr>
                                        </table>

                                        <!-- Divider -->
                                        <div style="border-top:1px solid #e2e8e6;margin:24px 0;"></div>

                                        <!-- WORK AUTHORIZATION -->
                                        <p
                                            style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2d6a5e;text-transform:uppercase;letter-spacing:0.8px;">
                                            Work Authorization</p>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;width:200px;">
                                                    SSN</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.ssn || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">
                                                    Authorization Status</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.workAuthStatus || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Visa Type
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.visaType || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Visa Expiry
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.visaExpiry || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Passport
                                                    Number</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.passportNumber || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Country of
                                                    Issue</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.countryOfIssue || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Passport
                                                    Expiry</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.passportExpiry || ""}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">I-94 Number
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.i94 || ""}</td>
                                            </tr>
                                        </table>

                                        <!-- Divider -->
                                        <div style="border-top:1px solid #e2e8e6;margin:24px 0;"></div>

                                        <!-- EDUCATION -->
                                        <p
                                            style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2d6a5e;text-transform:uppercase;letter-spacing:0.8px;">
                                            Education</p>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;width:200px;">
                                                    Highest Qualification</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.highestQualification || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Degree</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.degreeName || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">
                                                    Specialization</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.specialization || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">University
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.universityName || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Graduation
                                                    Year</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.graduationYear || ""}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">GPA /
                                                    Percentage</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.gpa || ""}</td>
                                            </tr>
                                        </table>

                                        <!-- Divider -->
                                        <div style="border-top:1px solid #e2e8e6;margin:24px 0;"></div>

                                        <!-- PAYROLL & TAX -->
                                        <p
                                            style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2d6a5e;text-transform:uppercase;letter-spacing:0.8px;">
                                            Payroll &amp; Tax</p>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;width:200px;">
                                                    Account Holder</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.accountHolderName || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Bank Name
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.bankName || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Routing
                                                    Number</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.routingNumber || ""}</td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Account
                                                    Number</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.accountNumber || ""}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Account Type
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    ${onboarding_form?.accountType || ""}</td>
                                            </tr>
                                        </table>

                                        <!-- Divider -->
                                        <div style="border-top:1px solid #e2e8e6;margin:24px 0;"></div>

                                        <!-- DOCUMENTS UPLOADED -->
                                        <p
                                            style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2d6a5e;text-transform:uppercase;letter-spacing:0.8px;">
                                            Documents Uploaded</p>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;width:200px;">
                                                    Passport</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    <a href="${onboarding_form?.passport_url || " #"}"
                                                        style="color:#2d6a5e;text-decoration:none;" target="_blank"
                                                        rel="noopener noreferrer">
                                                        passport 🔗
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">SSN Card
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    <a href="${onboarding_form?.ssn_url || " #"}"
                                                        style="color:#2d6a5e;text-decoration:none;" target="_blank"
                                                        rel="noopener noreferrer">
                                                        SSN card 🔗
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Visa / Work
                                                    Permit</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    <a href="${onboarding_form?.visa_url || " #"}"
                                                        style="color:#2d6a5e;text-decoration:none;" target="_blank"
                                                        rel="noopener noreferrer">
                                                        Visa / Work Permit 🔗
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Degree
                                                    Certificate</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    <a href="${onboarding_form?.degree_url || " #"}"
                                                        style="color:#2d6a5e;text-decoration:none;" target="_blank"
                                                        rel="noopener noreferrer">
                                                        Degree Certificate 🔗
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Cancelled /
                                                    Void Check</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    <a href="${onboarding_form?.void_check_url || " #"}"
                                                        style="color:#2d6a5e;text-decoration:none;" target="_blank"
                                                        rel="noopener noreferrer">
                                                        Cancelled / Void Check 🔗
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">I-94
                                                    Document</td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    <a href="${onboarding_form?.i94_url || " #"}"
                                                        style="color:#2d6a5e;text-decoration:none;" target="_blank"
                                                        rel="noopener noreferrer">
                                                        I-94 Document 🔗
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr style="border-bottom:1px dashed #e2e8e6;">
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">W4 Document
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    <a href="${onboarding_form?.w4_url || " #"}"
                                                        style="color:#2d6a5e;text-decoration:none;" target="_blank"
                                                        rel="noopener noreferrer">
                                                        W4 Document 🔗
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;font-size:13px;color:#6b8f87;font-weight:500;">Offer Letter
                                                </td>
                                                <td style="padding:6px 0;font-size:13px;color:#1a2e2a;font-weight:500;">
                                                    <a href="${onboarding_form?.offer_letter_url || " #"}"
                                                        style="color:#2d6a5e;text-decoration:none;" target="_blank"
                                                        rel="noopener noreferrer">
                                                        Offer Letter 🔗
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Divider -->
                                        <div style="border-top:1px solid #e2e8e6;margin:24px 0;"></div>

                                        <!-- Footer Note -->
                                        <div
                                            style="background:#f0f5f4;border:1px solid #c6d9d5;border-radius:7px;padding:14px 18px;font-size:13px;color:#2d6a5e;font-weight:500;line-height:1.6;">
                                            ⚠️ This email contains sensitive employee information.
                                        </div>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>

            </html>
        `

        const attachments = [
            { filename: 'passport.pdf', path: onboarding_form?.passport_url },
            { filename: 'ssn.pdf', path: onboarding_form?.ssn_url },
            { filename: 'degree_certificate.pdf', path: onboarding_form?.degree_url },
            { filename: 'offer_acknowledgement.pdf', path: onboarding_form?.offer_letter_url },
            { filename: 'visa.pdf', path: onboarding_form?.visa_url },
            { filename: 'void_check.pdf', path: onboarding_form?.void_check_url },
            { filename: 'i94.pdf', path: onboarding_form?.i94_url },
            { filename: 'w4.pdf', path: onboarding_form?.w4_url },
        ].filter(att => att.path);

        const { data, error } = await resend.emails.send({
            from: `HR Lavance LLC <${process.env.NEXT_PUBLIC_HR_EMAIL}>`,
            to: [process.env.NEXT_PUBLIC_HR_EMAIL],
            cc: [],
            subject: `${employeeId} - Onboarding Details Submitted`,
            html: htmlContent,
            attachments: attachments
        });

        if (error) {
            console.error("[onboarding-details-to-hr] Resend error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log(`${employeeId} - Onboarding details sent to ${process.env.NEXT_PUBLIC_HR_EMAIL}`);

        return NextResponse.json({
            success: true,
            id: data.id
        });

    } catch (err) {
        console.error("[onboarding-details-to-hr] Unexpected error:", err);
        return NextResponse.json(
            { error: "Failed to send onboarding details." },
            { status: 500 }
        );
    }
}