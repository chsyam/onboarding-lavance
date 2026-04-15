export function onboardingInviteTemplate({
    candidateName,
    jobTitle,
    department,
    startDate,
    formLink,
    expiryDate,
    hrName = "The HR Team",
    supportEmail = process.env.FROM_EMAIL,
}) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Complete Your Onboarding</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f0ede8;font-family:'DM Sans','Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ede8;padding:40px 16px 60px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- ─ Header ──────────────────────────────────────────────── -->
          <tr>
            <td style="background-color:#1a3c34;border-radius:12px 12px 0 0;padding:40px 48px 36px;text-align:center;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.55);letter-spacing:2px;text-transform:uppercase;">
                Employee Onboarding
              </p>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                Complete Your Onboarding Form
              </h1>
              <p style="margin:14px 0 0;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.5;">
                Action required before your start date
              </p>
            </td>
          </tr>

          <!-- ─ Body ───────────────────────────────────────────────── -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 48px 36px;border-left:1px solid #ddd9d2;border-right:1px solid #ddd9d2;">

              <p style="margin:0 0 22px;font-size:16px;color:#111827;line-height:1.7;">
                Dear <strong>${candidateName}</strong>,
              </p>

              <p style="margin:0 0 22px;font-size:15px;color:#374151;line-height:1.75;">
                We are thrilled to welcome you to the team as
                <strong>${jobTitle}</strong> in the <strong>${department}</strong> department.
                To ensure everything is ready before your first day, please complete
                your onboarding form at your earliest convenience.
              </p>

              <!-- Details card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background-color:#f7f5f1;border-radius:8px;border:1px solid #ddd9d2;padding:22px 26px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:5px 0;border-bottom:1px solid #e5e2dc;">
                          <span style="display:inline-block;width:140px;font-size:13px;font-weight:600;color:#6b7280;">Position</span>
                          <span style="font-size:13px;font-weight:700;color:#111827;">${jobTitle}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;border-bottom:1px solid #e5e2dc;">
                          <span style="display:inline-block;width:140px;font-size:13px;font-weight:600;color:#6b7280;">Department</span>
                          <span style="font-size:13px;font-weight:700;color:#111827;">${department}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;border-bottom:1px solid #e5e2dc;">
                          <span style="display:inline-block;width:140px;font-size:13px;font-weight:600;color:#6b7280;">Start date</span>
                          <span style="font-size:13px;font-weight:700;color:#111827;">${startDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;">
                          <span style="display:inline-block;width:140px;font-size:13px;font-weight:600;color:#6b7280;">Form deadline</span>
                          <span style="font-size:13px;font-weight:700;color:#b45309;">${expiryDate}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${formLink}" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="16%" fillcolor="#1a3c34" stroke="f">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Complete Onboarding Form</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${formLink}"
                       style="display:inline-block;background-color:#1a3c34;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 40px;border-radius:8px;letter-spacing:0.2px;line-height:1;">
                      Complete Onboarding Form
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- Deadline warning -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background-color:#fffbeb;border-radius:8px;border:1px solid #fde68a;border-left:4px solid #f59e0b;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.65;">
                      <strong>Please act before ${expiryDate}</strong> — this link expires in 7 days.
                      Complete all 6 steps including document uploads before the deadline.
                      After expiry, you will need to contact HR for a new link.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What to prepare -->
              <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#111827;">
                What you'll need to complete the form:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                ${[
            "Passport or government-issued photo ID",
            "Social Security Number (SSN) or ITIN",
            "Highest degree certificate or transcript",
            "Bank account details for direct deposit",
            "Signed offer letter (if not already submitted)",
        ].map(item => `
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#374151;line-height:1.6;">
                    <span style="color:#1a3c34;font-weight:700;margin-right:8px;">&#10003;</span>${item}
                  </td>
                </tr>`).join("")}
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#374151;line-height:1.75;">
                If you have any questions or encounter any issues, simply reply to
                this email and our HR team will get back to you promptly.
              </p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.75;">
                We look forward to welcoming you on board.<br />
                <strong>${hrName}</strong>
              </p>

            </td>
          </tr>

          <!-- ─ Footer ──────────────────────────────────────────────── -->
          <tr>
            <td style="background-color:#f7f5f1;border-radius:0 0 12px 12px;border:1px solid #ddd9d2;border-top:none;padding:22px 48px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;line-height:1.6;">
                This email was sent because you have accepted an offer of employment.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                If you believe this was sent in error, contact
                <a href="mailto:${supportEmail}" style="color:#1a3c34;text-decoration:none;">${supportEmail}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

    const text = `
Dear ${candidateName},

We are thrilled to welcome you to the team as ${jobTitle} in the ${department} department.

Please complete your onboarding form before ${expiryDate}:
${formLink}

DETAILS
-------
Position:      ${jobTitle}
Department:    ${department}
Start date:    ${startDate}
Form deadline: ${expiryDate}

WHAT YOU'LL NEED
----------------
- Passport or government-issued photo ID
- Social Security Number (SSN) or ITIN
- Highest degree certificate or transcript
- Bank account details for direct deposit
- Signed offer letter (if not already submitted)

This link expires in 7 days. Please complete all 6 steps, including document uploads,
before the deadline. After expiry, contact HR for a new link.

If you have any questions, reply to this email.

Best regards,
${hrName}

---
This email was sent because you accepted an offer of employment.
If this was sent in error, contact ${supportEmail}
  `.trim();

    return { html, text };
}


/**
 * Generates a plain confirmation email sent after the form is submitted.
 *
 * @param {object} params
 * @param {string} params.candidateName
 * @param {string} params.jobTitle
 * @param {string} params.startDate
 * @param {string} params.hrEmail
 * @returns {{ html: string, text: string }}
 */
export function onboardingConfirmationTemplate({
    candidateName,
    jobTitle,
    startDate,
    hrEmail = process.env.FROM_EMAIL,
}) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f0ede8;font-family:'DM Sans','Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ede8;padding:40px 16px 60px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background-color:#1a3c34;border-radius:12px 12px 0 0;padding:40px 48px;text-align:center;">
            <p style="margin:0 0 10px;font-size:32px;">&#10003;</p>
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;">Onboarding Form Received</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color:#ffffff;padding:40px 48px;border-left:1px solid #ddd9d2;border-right:1px solid #ddd9d2;">
            <p style="margin:0 0 20px;font-size:16px;color:#111827;">Dear <strong>${candidateName}</strong>,</p>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.75;">
              Thank you — your onboarding form has been successfully submitted.
              Our HR team will review your documents and be in touch within <strong>1–2 business days</strong>.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f1;border-radius:8px;border:1px solid #ddd9d2;padding:20px 24px;margin:0 0 24px;">
              <tr><td style="padding:4px 0;">
                <span style="display:inline-block;width:120px;font-size:13px;font-weight:600;color:#6b7280;">Position</span>
                <span style="font-size:13px;font-weight:700;color:#111827;">${jobTitle}</span>
              </td></tr>
              <tr><td style="padding:4px 0;">
                <span style="display:inline-block;width:120px;font-size:13px;font-weight:600;color:#6b7280;">Start date</span>
                <span style="font-size:13px;font-weight:700;color:#111827;">${startDate}</span>
              </td></tr>
            </table>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.75;">
              Questions? Reply to this email or contact
              <a href="mailto:${hrEmail}" style="color:#1a3c34;">${hrEmail}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f7f5f1;border-radius:0 0 12px 12px;border:1px solid #ddd9d2;border-top:none;padding:20px 48px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">You are receiving this because you submitted an onboarding form.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const text = `
Dear ${candidateName},

Your onboarding form has been successfully submitted.
Our HR team will review your documents and be in touch within 1-2 business days.

Position:   ${jobTitle}
Start date: ${startDate}

Questions? Contact ${hrEmail}
  `.trim();

    return { html, text };
}