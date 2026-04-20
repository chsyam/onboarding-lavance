'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const STATUS = {
    not_started: { bg: '#f3f4f6', text: '#6b7280', label: 'Not Started' },
    sent: { bg: '#ede9fe', text: '#6d28d9', label: 'Invited' },
    in_progress: { bg: '#fef3c7', text: '#d97706', label: 'In Progress' },
    completed: { bg: '#d1fae5', text: '#065f46', label: 'Completed' },
    terminated: { bg: '#fee2e2', text: '#991b1b', label: 'Terminated' },
};

const TIMELINE_STEPS = [
    { key: 'created', label: 'Employee Created', icon: '✦' },
    { key: 'sent', label: 'Onboarding Email Sent', icon: '✉' },
    { key: 'in_progress', label: 'Onboarding In Progress', icon: '◎' },
    { key: 'completed', label: 'Onboarding Completed', icon: '✔' },
];

function Section({ title, children }) {
    return (
        <div style={{
            background: '#fff', borderRadius: 14,
            border: '1px solid #ede9fe',
            overflow: 'hidden', marginBottom: 16,
        }}>
            <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #f3f0ff',
                background: '#faf9ff',
            }}>
                <h3 style={{
                    margin: 0, fontSize: 14, fontWeight: 600,
                    color: '#4f46e5'
                }}>{title}</h3>
            </div>
            <div style={{ padding: '16px 20px' }}>{children}</div>
        </div>
    );
}

function Field({ label, value }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <p style={{
                margin: 0, fontSize: 11, fontWeight: 600,
                color: '#9ca3af', textTransform: 'uppercase',
                letterSpacing: '0.06em'
            }}>{label}</p>
            <p style={{
                margin: '3px 0 0', fontSize: 14,
                color: value ? '#1e1b4b' : '#d1d5db'
            }}>
                {value || '—'}
            </p>
        </div>
    );
}

function Grid({ children }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 24px'
        }}>
            {children}
        </div>
    );
}

function Avatar({ first, last, size = 56 }) {
    const initials = `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: '#ede9fe', color: '#6d28d9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: size * 0.3, flexShrink: 0,
        }}>{initials}</div>
    );
}

export default function EmployeeProfilePage() {
    const router = useRouter();
    const { id } = useParams();
    const [emp, setEmp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [showTermModal, setShowTermModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/employees/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json();
            setEmp(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        // async function fetchEmployee() {
        //     setLoading(true);
        //     const response = await fetch(`/api/admin/employees/${id}`, {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json",
        //         }
        //     });
        //     const data = await response.json();
        //     setEmp(data.data);
        //     setLoading(false);
        // }

        if (id) fetchEmployee();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleSendOnboarding() {
        setActionLoading('onboarding');
        await fetch('/api/emails/onboarding/send-invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: id,
                candidateName: emp?.first_name || "" + emp?.last_name || "",
                candidateEmail: emp?.email,
                startDate: emp?.started_dt,
                jobTitle: emp?.role,
                token: emp?.token
            }),
        });

        setActionLoading(null);
        fetchEmployee();
    }

    async function handleTerminate() {
        setActionLoading('terminate');
        await fetch(`/api/admin/employees/${id}/terminate`, {
            method: 'POST'
        });
        setActionLoading(null);
        setShowTermModal(false);
        fetchEmployee();
    }

    async function handleResetOnboarding() {
        setActionLoading('reset');
        await fetch(`/api/admin/employees/${id}/reset-onboarding`, {
            method: 'POST'
        });
        setActionLoading(null);
        setShowResetModal(false);
        fetchEmployee();
    }

    if (loading) return (
        <div style={{
            minHeight: '100vh', background: '#f5f4ff',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#6b7280'
        }}>
            Loading...
        </div>
    );

    if (!emp) return (
        <div style={{
            minHeight: '100vh', background: '#f5f4ff',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#6b7280'
        }}>
            Employee not found.
        </div>
    );

    const status = STATUS[emp.onboarding_status] || STATUS.not_started;
    const currentStep = TIMELINE_STEPS.findIndex(s => s.key === emp.onboarding_status);

    return (
        <div style={{ minHeight: '100vh', background: '#f5f4ff', padding: '2rem' }}>

            {/* Back */}
            <button
                onClick={() => router.push('/admin/employees')}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6b7280', fontSize: 14, marginBottom: '1.25rem',
                    display: 'flex', alignItems: 'center', gap: 6, padding: 0,
                }}>
                ← Back to Employees
            </button>

            {/* Profile Header */}
            <div style={{
                background: '#fff', borderRadius: 16,
                border: '1px solid #ede9fe',
                padding: '1.5rem 2rem', marginBottom: 16,
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: 16,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar first={emp.first_name} last={emp.last_name} size={56} />
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: 20, fontWeight: 700,
                            color: '#1e1b4b'
                        }}>
                            {emp.first_name} {emp.last_name}
                        </h1>
                        <p style={{ margin: '2px 0 0', fontSize: 14, color: '#6b7280' }}>
                            {emp.role}{emp.department ? ` · ${emp.department}` : ''}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>
                            {emp.email}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>

                    {/* Send / Resend Onboarding */}
                    {emp.onboarding_status !== 'terminated' &&
                        emp.onboarding_status !== 'completed' && (
                            <button
                                onClick={handleSendOnboarding}
                                disabled={actionLoading === 'onboarding'}
                                style={{
                                    padding: '9px 18px', borderRadius: 10,
                                    border: 'none', background: '#4f46e5',
                                    color: '#fff', fontSize: 13, fontWeight: 500,
                                    cursor: 'pointer', opacity: actionLoading === 'onboarding' ? 0.7 : 1,
                                }}>
                                {actionLoading === 'onboarding' ? 'Sending...'
                                    : emp.onboarding_status === 'not_started'
                                        ? 'Send Onboarding' : 'Resend Onboarding'}
                            </button>
                        )}

                    {/* Edit */}
                    {/* {emp.onboarding_status !== 'terminated' && (
                        <button
                            onClick={() => router.push(`/admin/employees/${id}/edit`)}
                            style={{
                                padding: '9px 18px', borderRadius: 10,
                                border: '1px solid #ede9fe', background: '#fff',
                                color: '#4f46e5', fontSize: 13, fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                            Edit Details
                        </button>
                    )} */}

                    {/* Reset Onboarding */}
                    {(emp.onboarding_status === 'sent' ||
                        emp.onboarding_status === 'in_progress' ||
                        emp.onboarding_status === 'completed') && (
                            <button
                                onClick={() => setShowResetModal(true)}
                                style={{
                                    padding: '9px 18px', borderRadius: 10,
                                    border: '1px solid #fde68a', background: '#fffbeb',
                                    color: '#d97706', fontSize: 13, fontWeight: 500,
                                    cursor: 'pointer',
                                }}>
                                Reset Onboarding
                            </button>
                        )}

                    {/* Terminate */}
                    {/* {emp.onboarding_status !== 'terminated' && (
                        <button
                            onClick={() => setShowTermModal(true)}
                            style={{
                                padding: '9px 18px', borderRadius: 10,
                                border: '1px solid #fecaca', background: '#fff5f5',
                                color: '#dc2626', fontSize: 13, fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                            Terminate
                        </button>
                    )} */}

                    {/* Status Badge */}
                    <span style={{
                        background: status.bg, color: status.text,
                        padding: '9px 16px', borderRadius: 10,
                        fontSize: 13, fontWeight: 600,
                        display: 'flex', alignItems: 'center',
                    }}>{status.label}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>

                {/* Left column */}
                <div>

                    {/* Personal Info */}
                    <Section title="Personal Information">
                        <Grid>
                            <Field label="First Name" value={emp.first_name} />
                            <Field label="Last Name" value={emp.last_name} />
                            <Field label="Display Name" value={emp.display_name} />
                            <Field label="Email" value={emp.email} />
                            <Field label="Phone" value={emp.phone} />
                            <Field label="Date of Birth" value={emp.date_of_birth
                                ? new Date(emp.date_of_birth).toLocaleDateString() : null} />
                            <Field label="Gender" value={emp.gender} />
                            <Field label="Marital Status" value={emp.marital_status} />
                            <Field label="Nationality" value={emp.nationality} />
                        </Grid>
                    </Section>

                    {/* Address */}
                    <Section title="Address">
                        <p style={{
                            margin: '0 0 12px', fontSize: 12,
                            fontWeight: 600, color: '#9ca3af'
                        }}>
                            RESIDENTIAL
                        </p>
                        <Grid>
                            <Field label="Address Line 1" value={emp.address?.residential_address_line1} />
                            <Field label="Address Line 2" value={emp.address?.residential_address_line2} />
                            <Field label="City" value={emp.address?.residential_city} />
                            <Field label="State" value={emp.address?.residential_state} />
                            <Field label="Zip Code" value={emp.address?.residential_zip_code} />
                            <Field label="Country" value={emp.address?.residential_country} />
                        </Grid>
                        {!emp.address?.residential_permanent_same && (<>
                            <p style={{
                                margin: '16px 0 12px', fontSize: 12,
                                fontWeight: 600, color: '#9ca3af'
                            }}>
                                PERMANENT
                            </p>
                            <Grid>
                                <Field label="Address Line 1" value={emp.address?.permanent_address_line1} />
                                <Field label="Address Line 2" value={emp.address?.permanent_address_line2} />
                                <Field label="City" value={emp.address?.permanent_city} />
                                <Field label="State" value={emp.address?.permanent_state} />
                                <Field label="Zip Code" value={emp.address?.permanent_zip_code} />
                                <Field label="Country" value={emp.address?.permanent_country} />
                            </Grid>
                        </>)}
                    </Section>

                    {/* Work Authorization */}
                    <Section title="Work Authorization">
                        <Grid>
                            <Field label="Authorization Type" value={emp.work_auth?.work_authorization_status} />
                            <Field label="Visa Type" value={emp.work_auth?.visa_type} />
                            <Field label="Visa Expiry" value={emp.work_auth?.visa_expiry_date
                                ? new Date(emp.work_auth.visa_expiry_date).toLocaleDateString() : null} />
                            <Field label="Passport Number" value={emp.work_auth?.passport_number} />
                            <Field label="Country of Issue" value={emp.work_auth?.country_of_issue} />
                            <Field label="Passport Expiry" value={emp.work_auth?.passport_expiry_date
                                ? new Date(emp.work_auth.passport_expiry_date).toLocaleDateString() : null} />
                            <Field label="Work Permit No." value={emp.work_auth?.work_permit_number} />
                            <Field label="SSN" value={emp.work_auth?.ssn
                                ? `***-**-${emp.work_auth.ssn.slice(-4)}` : null} />
                        </Grid>
                    </Section>

                    {/* Education */}
                    <Section title="Education">
                        {emp.education?.length ? emp.education.map((ed, i) => (
                            <div key={i} style={{
                                padding: '12px 16px', borderRadius: 10,
                                background: '#faf9ff', border: '1px solid #ede9fe',
                                marginBottom: 10,
                            }}>
                                <Grid>
                                    <Field label="Qualification" value={ed.highest_qualification} />
                                    <Field label="Degree" value={ed.degree_name} />
                                    <Field label="Specialization" value={ed.specialization} />
                                    <Field label="University" value={ed.university} />
                                    <Field label="Graduated Year" value={ed.graduated_year} />
                                    <Field label="Grade" value={ed.grade} />
                                </Grid>
                            </div>
                        )) : <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
                            No education records.</p>}
                    </Section>

                    {/* Payroll */}
                    <Section title="Payroll & Bank Details">
                        <Grid>
                            <Field label="Bank Name" value={emp.payroll?.bank_name} />
                            <Field label="Routing Number" value={emp.payroll?.routing_number
                                ? `****${emp.payroll.routing_number.slice(-4)}` : null} />
                            <Field label="Account Number" value={emp.payroll?.account_number
                                ? `****${emp.payroll.account_number.slice(-4)}` : null} />
                        </Grid>
                    </Section>

                    {/* Documents */}
                    <Section title="Documents">
                        {emp.documents ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3,1fr)', gap: 10
                            }}>
                                {[
                                    ['Passport', emp.documents.passport],
                                    ['SSN', emp.documents.ssn],
                                    ['Work Permit', emp.documents.work_permit],
                                    ['Resume', emp.documents.resume],
                                    ['Degree Certificate', emp.documents.latest_degree_certificate],
                                    ['Experience Letter', emp.documents.experience_letter],
                                    ['Payslip 1', emp.documents.previous_payslip_1],
                                    ['Payslip 2', emp.documents.previous_payslip_2],
                                    ['Payslip 3', emp.documents.previous_payslip_3],
                                    ['Offer Acknowledgement', emp.documents.offer_acknowledgement],
                                    ['Signed NDA', emp.documents.signed_nda],
                                ].map(([label, url]) => (
                                    <div key={label} style={{
                                        padding: '10px 14px', borderRadius: 10,
                                        border: `1px solid ${url ? '#ede9fe' : '#f3f4f6'}`,
                                        background: url ? '#faf9ff' : '#fafafa',
                                        display: 'flex', flexDirection: 'column', gap: 6,
                                    }}>
                                        <p style={{
                                            margin: 0, fontSize: 12,
                                            fontWeight: 600, color: '#6b7280'
                                        }}>
                                            {label}
                                        </p>
                                        {url ? (
                                            <a href={url} target="_blank" rel="noreferrer"
                                                style={{
                                                    fontSize: 12, color: '#4f46e5',
                                                    textDecoration: 'none', fontWeight: 500
                                                }}>
                                                View / Download
                                            </a>
                                        ) : (
                                            <span style={{ fontSize: 12, color: '#d1d5db' }}>
                                                Not uploaded
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
                            No documents uploaded.</p>}
                    </Section>
                </div>

                {/* Right column — Timeline + Job Info */}
                <div>

                    {/* Job Info */}
                    <div style={{
                        background: '#fff', borderRadius: 14,
                        border: '1px solid #ede9fe', padding: '1.25rem',
                        marginBottom: 16,
                    }}>
                        <h3 style={{
                            margin: '0 0 14px', fontSize: 14,
                            fontWeight: 600, color: '#4f46e5'
                        }}>
                            Employment Details
                        </h3>
                        <Field label="Role" value={emp.role} />
                        <Field label="Job Type" value={emp.job_type?.replace('_', ' ')} />
                        <Field label="Bill Rate" value={emp.bill_rate ? `$${emp.bill_rate}/hr` : null} />
                        <Field label="Start Date" value={emp.started_dt
                            ? new Date(emp.started_dt).toLocaleDateString() : null} />
                        <Field label="Member Since" value={emp.created_at
                            ? new Date(emp.created_at).toLocaleDateString() : null} />
                    </div>

                    {/* Onboarding Timeline */}
                    <div style={{
                        background: '#fff', borderRadius: 14,
                        border: '1px solid #ede9fe', padding: '1.25rem',
                    }}>
                        <h3 style={{
                            margin: '0 0 20px', fontSize: 14,
                            fontWeight: 600, color: '#4f46e5'
                        }}>
                            Onboarding Timeline
                        </h3>
                        {TIMELINE_STEPS.map((step, i) => {
                            const done = i <= currentStep;
                            const current = i === currentStep;
                            return (
                                <div key={step.key} style={{
                                    display: 'flex', gap: 14,
                                    marginBottom: i < TIMELINE_STEPS.length - 1 ? 0 : 0,
                                }}>
                                    {/* Line + dot */}
                                    <div style={{
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', width: 24
                                    }}>
                                        <div style={{
                                            width: 24, height: 24, borderRadius: '50%',
                                            background: done ? '#4f46e5' : '#f3f4f6',
                                            border: current ? '3px solid #c7d2fe' : 'none',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 11, color: done ? '#fff' : '#d1d5db',
                                            flexShrink: 0, fontWeight: 700,
                                            boxSizing: 'border-box',
                                        }}>
                                            {done ? '✓' : ''}
                                        </div>
                                        {i < TIMELINE_STEPS.length - 1 && (
                                            <div style={{
                                                width: 2, flex: 1, minHeight: 28,
                                                background: i < currentStep ? '#4f46e5' : '#f3f4f6',
                                                margin: '3px 0',
                                            }} />
                                        )}
                                    </div>
                                    {/* Label */}
                                    <div style={{ paddingBottom: 20 }}>
                                        <p style={{
                                            margin: 0, fontSize: 13,
                                            fontWeight: current ? 600 : 500,
                                            color: done ? '#1e1b4b' : '#9ca3af',
                                        }}>{step.label}</p>
                                        {current && (
                                            <p style={{
                                                margin: '2px 0 0', fontSize: 11,
                                                color: '#6d28d9'
                                            }}>Current step</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Terminate Modal */}
            {showTermModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 16,
                        padding: '2rem', width: '100%', maxWidth: 420,
                    }}>
                        <h2 style={{
                            margin: '0 0 8px', fontSize: 18,
                            fontWeight: 700, color: '#1e1b4b'
                        }}>
                            Terminate Employee?
                        </h2>
                        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280' }}>
                            This will mark <strong>{emp.first_name} {emp.last_name}</strong> as
                            terminated. This action can be undone by an admin.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowTermModal(false)}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: 10,
                                    border: '1px solid #e5e7eb', background: '#fff',
                                    fontSize: 14, cursor: 'pointer', color: '#374151',
                                }}>Cancel</button>
                            <button onClick={handleTerminate}
                                disabled={actionLoading === 'terminate'}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: 10,
                                    border: 'none', background: '#dc2626',
                                    fontSize: 14, fontWeight: 500,
                                    cursor: 'pointer', color: '#fff',
                                    opacity: actionLoading === 'terminate' ? 0.7 : 1,
                                }}>
                                {actionLoading === 'terminate' ? 'Processing...' : 'Yes, Terminate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Onboarding Modal */}
            {showResetModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 16,
                        padding: '2rem', width: '100%', maxWidth: 420,
                    }}>
                        <h2 style={{
                            margin: '0 0 8px', fontSize: 18,
                            fontWeight: 700, color: '#1e1b4b'
                        }}>
                            Reset Onboarding?
                        </h2>
                        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280' }}>
                            This will reset <strong>{emp.first_name} {emp.last_name}</strong> onboarding
                            status back to the start and generate a new token.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowResetModal(false)}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: 10,
                                    border: '1px solid #e5e7eb', background: '#fff',
                                    fontSize: 14, cursor: 'pointer', color: '#374151',
                                }}>Cancel</button>
                            <button onClick={handleResetOnboarding}
                                disabled={actionLoading === 'reset'}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: 10,
                                    border: 'none', background: '#d97706',
                                    fontSize: 14, fontWeight: 500,
                                    cursor: 'pointer', color: '#fff',
                                    opacity: actionLoading === 'reset' ? 0.7 : 1,
                                }}>
                                {actionLoading === 'reset' ? 'Resetting...' : 'Yes, Reset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}