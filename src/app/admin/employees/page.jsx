'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STATUS = {
    not_sent: { bg: '#f3f4f6', text: '#6b7280', label: 'Not Started' },
    sent: { bg: '#ede9fe', text: '#6d28d9', label: 'Invited' },
    in_progress: { bg: '#fef3c7', text: '#d97706', label: 'In Progress' },
    completed: { bg: '#d1fae5', text: '#065f46', label: 'Completed' },
    terminated: { bg: '#fee2e2', text: '#991b1b', label: 'Terminated' },
};

const EMPTY_FORM = {
    first_name: '', last_name: '', email: '', phone: '',
    role: '', department: '', job_type: 'full_time',
    bill_rate: '', started_dt: '', gender: '',
    marital_status: '', date_of_birth: '', nationality: '',
};

function Avatar({ first, last, size = 36 }) {
    const initials = `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: '#ede9fe', color: '#6d28d9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, fontSize: size * 0.3, flexShrink: 0,
        }}>{initials || '?'}</div>
    );
}

// ─── Reusable field components ───────────────────────────────────────────────

function Label({ children, required }) {
    return (
        <label style={{
            fontSize: 12, fontWeight: 600, color: '#374151',
            marginBottom: 5, display: 'block', letterSpacing: '0.02em'
        }}>
            {children}
            {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
        </label>
    );
}

function Input({ value, onChange, type = 'text', placeholder, error, disabled }) {
    return (
        <>
            <input
                type={type} value={value} onChange={onChange}
                placeholder={placeholder} disabled={disabled}
                style={{
                    width: '100%', padding: '9px 12px', borderRadius: 8,
                    border: `1px solid ${error ? '#fca5a5' : '#e5e7eb'}`,
                    fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    background: disabled ? '#f9fafb' : '#fff',
                    color: '#1e1b4b',
                    transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#a5b4fc'}
                onBlur={e => e.target.style.borderColor = error ? '#fca5a5' : '#e5e7eb'}
            />
            {error && <p style={{
                margin: '4px 0 0', fontSize: 11,
                color: '#ef4444'
            }}>{error}</p>}
        </>
    );
}

function Select({ value, onChange, options, error }) {
    return (
        <>
            <select value={value} onChange={onChange}
                style={{
                    width: '100%', padding: '9px 12px', borderRadius: 8,
                    border: `1px solid ${error ? '#fca5a5' : '#e5e7eb'}`,
                    fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    background: '#fff', color: value ? '#1e1b4b' : '#9ca3af',
                    cursor: 'pointer',
                }}
                onFocus={e => e.target.style.borderColor = '#a5b4fc'}
                onBlur={e => e.target.style.borderColor = error ? '#fca5a5' : '#e5e7eb'}>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {error && <p style={{
                margin: '4px 0 0', fontSize: 11,
                color: '#ef4444'
            }}>{error}</p>}
        </>
    );
}

function FieldGroup({ children }) {
    return <div style={{ marginBottom: 16 }}>{children}</div>;
}

function Row({ children, cols = 2 }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 14
        }}>
            {children}
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <div style={{
            fontSize: 11, fontWeight: 700, color: '#6d28d9',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '10px 0 10px', marginTop: 4,
            borderBottom: '1px solid #f3f0ff', marginBottom: 16,
        }}>{children}</div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function EmployeeListPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);

    useEffect(() => { fetchEmployees(); }, []);

    // lock body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    async function fetchEmployees() {
        setLoading(true);
        const response = await fetch("/api/admin/employees", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();
        console.log(data);

        setEmployees(data?.result || []);
        setLoading(false);
    }

    function openCreate() {
        setForm(EMPTY_FORM);
        setErrors({});
        setEditMode(false);
        setEditId(null);
        setSavedOk(false);
        setDrawerOpen(true);
    }

    function openEdit(emp) {
        setForm({
            first_name: emp.first_name || '',
            last_name: emp.last_name || '',
            email: emp.email || '',
            phone: emp.phone || '',
            role: emp.role || '',
            department: emp.department || '',
            job_type: emp.job_type || 'full_time',
            bill_rate: emp.bill_rate || '',
            started_dt: emp.started_dt
                ? emp.started_dt.split('T')[0] : '',
            gender: emp.gender || '',
            marital_status: emp.marital_status || '',
            date_of_birth: emp.date_of_birth
                ? emp.date_of_birth.split('T')[0] : '',
            nationality: emp.nationality || '',
        });
        setErrors({});
        setEditMode(true);
        setEditId(emp.id);
        setSavedOk(false);
        setDrawerOpen(true);
    }

    function set(field) {
        return e => {
            setForm(p => ({ ...p, [field]: e.target.value }));
            if (errors[field]) setErrors(p => ({ ...p, [field]: null }));
        };
    }

    function validate() {
        const e = {};
        if (!form.first_name.trim()) e.first_name = 'Required';
        if (!form.last_name.trim()) e.last_name = 'Required';
        if (!form.email.trim()) e.email = 'Required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!form.role.trim()) e.role = 'Required';
        if (!form.started_dt) e.started_dt = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);

        try {
            const url = editMode
                ? `/api/admin/employees/${editId}`
                : '/api/admin/employees';
            const method = editMode ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error();
            setSavedOk(true);
            fetchEmployees();
            setTimeout(() => {
                setDrawerOpen(false);
                setSavedOk(false);
            }, 1200);
        } catch {
            alert('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        console.log(employees)
    }, [employees])

    const filtered = employees?.filter(e => {
        const q = search.toLowerCase();
        const matchSearch =
            `${e.first_name} ${e.last_name} ${e.email} ${e.role} ${e.department}`
                .toLowerCase().includes(q);
        const matchFilter = filter === 'all' || e.onboarding_status === filter;
        return matchSearch && matchFilter;
    });

    const stats = {
        total: employees.length,
        in_progress: employees.filter(e => e.onboarding_status === 'in_progress').length,
        completed: employees.filter(e => e.onboarding_status === 'completed').length,
        terminated: employees.filter(e => e.onboarding_status === 'terminated').length,
    };

    return (
        <>
            <div style={{ minHeight: '100vh', background: '#f5f4ff', padding: '2rem' }}>

                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '1.5rem'
                }}>
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: 24, fontWeight: 700,
                            color: '#1e1b4b'
                        }}>Employees</h1>
                        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                            Manage your team and track onboarding progress
                        </p>
                    </div>
                    <button onClick={openCreate} style={{
                        background: '#4f46e5', color: '#fff', border: 'none',
                        padding: '10px 20px', borderRadius: 10, fontSize: 14,
                        fontWeight: 500, cursor: 'pointer',
                    }}>+ Add Employee</button>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                    gap: 12, marginBottom: '1.5rem'
                }}>
                    {[
                        { label: 'Total Employees', value: stats.total, color: '#4f46e5' },
                        { label: 'In Progress', value: stats.in_progress, color: '#d97706' },
                        { label: 'Completed', value: stats.completed, color: '#065f46' },
                        { label: 'Terminated', value: stats.terminated, color: '#991b1b' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: '#fff', borderRadius: 12,
                            border: '1px solid #ede9fe', padding: '1rem 1.25rem',
                        }}>
                            <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{s.label}</p>
                            <p style={{
                                margin: '4px 0 0', fontSize: 26,
                                fontWeight: 700, color: s.color
                            }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex', gap: 10, marginBottom: '1rem',
                    flexWrap: 'wrap', alignItems: 'center'
                }}>
                    <input
                        placeholder="Search by name, email, role..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{
                            flex: 1, minWidth: 200, padding: '9px 14px',
                            borderRadius: 10, border: '1px solid #e5e7eb',
                            fontSize: 14, outline: 'none', background: '#fff',
                        }}
                    />
                    {['all', 'not_sent', 'sent', 'in_progress', 'completed', 'terminated'].map(s => (
                        <button key={s} onClick={() => setFilter(s)} style={{
                            padding: '7px 14px', borderRadius: 20, fontSize: 12,
                            border: '1px solid',
                            borderColor: filter === s ? '#4f46e5' : '#e5e7eb',
                            background: filter === s ? '#ede9fe' : '#fff',
                            color: filter === s ? '#4f46e5' : '#6b7280',
                            cursor: 'pointer', fontWeight: filter === s ? 600 : 400,
                        }}>
                            {s === 'all' ? 'All' : STATUS[s]?.label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div style={{
                    background: '#fff', borderRadius: 14,
                    border: '1px solid #ede9fe', overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: '#f5f3ff' }}>
                                {['Employee', 'Department & Role', 'Job Type',
                                    'Start Date', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{
                                            padding: '12px 16px', textAlign: 'left',
                                            fontSize: 11, fontWeight: 600, color: '#6d28d9',
                                            letterSpacing: '0.06em', textTransform: 'uppercase',
                                            borderBottom: '1px solid #ede9fe',
                                        }}>{h}</th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{
                                    padding: '2rem',
                                    textAlign: 'center', color: '#9ca3af'
                                }}>
                                    Loading...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} style={{
                                    padding: '3rem',
                                    textAlign: 'center', color: '#9ca3af'
                                }}>
                                    No employees found.</td></tr>
                            ) : filtered.map((emp, i) => {
                                const s = STATUS[emp.onboarding_status] || STATUS.not_sent;
                                return (
                                    <tr key={emp.id} style={{
                                        borderBottom: '1px solid #f3f4f6',
                                        background: i % 2 === 0 ? '#fff' : '#fafafa',
                                    }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center', gap: 10
                                            }}>
                                                <Avatar first={emp.first_name}
                                                    last={emp.last_name} />
                                                <div>
                                                    <p onClick={() => router.push(
                                                        `/admin/employees/${emp.id}`)}
                                                        style={{
                                                            margin: 0, fontWeight: 600,
                                                            color: '#4f46e5', cursor: 'pointer',
                                                            fontSize: 14
                                                        }}>
                                                        {emp.first_name} {emp.last_name}
                                                    </p>
                                                    <p style={{
                                                        margin: 0, fontSize: 12,
                                                        color: '#9ca3af'
                                                    }}>{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <p style={{
                                                margin: 0, color: '#374151',
                                                fontWeight: 500
                                            }}>{emp.role || '—'}</p>
                                            <p style={{
                                                margin: 0, fontSize: 12,
                                                color: '#9ca3af'
                                            }}>
                                                {emp.department || '—'}</p>
                                        </td>
                                        <td style={{
                                            padding: '12px 16px', color: '#374151',
                                            textTransform: 'capitalize'
                                        }}>
                                            {emp.job_type?.replace('_', ' ') || '—'}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#374151' }}>
                                            {emp.started_dt
                                                ? new Date(emp.started_dt).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                background: s.bg, color: s.text,
                                                padding: '3px 12px', borderRadius: 20,
                                                fontSize: 12, fontWeight: 500,
                                            }}>{s.label}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    onClick={() => router.push(
                                                        `/admin/employees/${emp.id}`)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: 7,
                                                        border: '1px solid #ede9fe',
                                                        background: '#fff', color: '#4f46e5',
                                                        fontSize: 12, cursor: 'pointer',
                                                        fontWeight: 500,
                                                    }}>View</button>
                                                <button
                                                    onClick={() => openEdit(emp)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: 7,
                                                        border: '1px solid #e5e7eb',
                                                        background: '#fff', color: '#374151',
                                                        fontSize: 12, cursor: 'pointer',
                                                        fontWeight: 500,
                                                    }}>Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Slide-in Drawer ─────────────────────────────────────────────── */}
            {/* Backdrop */}
            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 998,
                        background: 'rgba(0,0,0,0.35)',
                        animation: 'fadeIn 0.2s ease',
                    }}
                />
            )}

            {/* Drawer Panel */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '100%', maxWidth: 560, zIndex: 999,
                background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column',
                transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}>

                {/* Drawer Header */}
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid #f3f0ff',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar
                            first={form.first_name || (editMode ? '' : '?')}
                            last={form.last_name}
                            size={40}
                        />
                        <div>
                            <h2 style={{
                                margin: 0, fontSize: 16, fontWeight: 700,
                                color: '#1e1b4b'
                            }}>
                                {editMode ? 'Edit Employee' : 'Add New Employee'}
                            </h2>
                            <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
                                {editMode
                                    ? `${form.first_name} ${form.last_name}`
                                    : 'Fill in the details below'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setDrawerOpen(false)} style={{
                        background: '#f3f4f6', border: 'none', borderRadius: '50%',
                        width: 32, height: 32, fontSize: 18, cursor: 'pointer',
                        color: '#6b7280', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                    }}>×</button>
                </div>

                {/* Scrollable Form Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
                    <form id="emp-form" onSubmit={handleSubmit}>

                        <SectionTitle>Basic Information</SectionTitle>
                        <Row>
                            <FieldGroup>
                                <Label required>First Name</Label>
                                <Input value={form.first_name} onChange={set('first_name')}
                                    placeholder="John" error={errors.first_name} />
                            </FieldGroup>
                            <FieldGroup>
                                <Label required>Last Name</Label>
                                <Input value={form.last_name} onChange={set('last_name')}
                                    placeholder="Doe" error={errors.last_name} />
                            </FieldGroup>
                        </Row>
                        <FieldGroup>
                            <Label required>Email Address</Label>
                            <Input value={form.email} onChange={set('email')}
                                type="email" placeholder="john@company.com"
                                error={errors.email}
                                disabled={editMode} />
                            {editMode && (
                                <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>
                                    Email cannot be changed after creation
                                </p>
                            )}
                        </FieldGroup>
                        <FieldGroup>
                            <Label>Phone Number</Label>
                            <Input value={form.phone} onChange={set('phone')}
                                placeholder="+1 555 000 0000" />
                        </FieldGroup>
                        <Row>
                            <FieldGroup>
                                <Label>Date of Birth</Label>
                                <Input value={form.date_of_birth}
                                    onChange={set('date_of_birth')} type="date" />
                            </FieldGroup>
                            <FieldGroup>
                                <Label>Gender</Label>
                                <Select value={form.gender} onChange={set('gender')}
                                    options={[
                                        { value: '', label: 'Select...' },
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                        { value: 'other', label: 'Other' },
                                        { value: 'prefer_not', label: 'Prefer not to say' },
                                    ]} />
                            </FieldGroup>
                        </Row>
                        <Row>
                            <FieldGroup>
                                <Label>Marital Status</Label>
                                <Select value={form.marital_status}
                                    onChange={set('marital_status')}
                                    options={[
                                        { value: '', label: 'Select...' },
                                        { value: 'single', label: 'Single' },
                                        { value: 'married', label: 'Married' },
                                        { value: 'divorced', label: 'Divorced' },
                                        { value: 'widowed', label: 'Widowed' },
                                    ]} />
                            </FieldGroup>
                            <FieldGroup>
                                <Label>Nationality</Label>
                                <Input value={form.nationality}
                                    onChange={set('nationality')}
                                    placeholder="American" />
                            </FieldGroup>
                        </Row>

                        <SectionTitle>Employment Details</SectionTitle>
                        <Row>
                            <FieldGroup>
                                <Label required>Job Title / Role</Label>
                                <Input value={form.role} onChange={set('role')}
                                    placeholder="Software Engineer"
                                    error={errors.role} />
                            </FieldGroup>
                            <FieldGroup>
                                <Label>Department</Label>
                                <Input value={form.department}
                                    onChange={set('department')}
                                    placeholder="Engineering" />
                            </FieldGroup>
                        </Row>
                        <Row>
                            <FieldGroup>
                                <Label>Job Type</Label>
                                <Select value={form.job_type} onChange={set('job_type')}
                                    options={[
                                        { value: 'full_time', label: 'Full Time' },
                                        { value: 'part_time', label: 'Part Time' },
                                        { value: 'contract', label: 'Contract' },
                                        { value: 'intern', label: 'Intern' },
                                    ]} />
                            </FieldGroup>
                            <FieldGroup>
                                <Label>Bill Rate ($/hr)</Label>
                                <Input value={form.bill_rate} onChange={set('bill_rate')}
                                    type="number" placeholder="85" />
                            </FieldGroup>
                        </Row>
                        <FieldGroup>
                            <Label required>Start Date</Label>
                            <Input value={form.started_dt} onChange={set('started_dt')}
                                type="date" error={errors.started_dt} />
                        </FieldGroup>

                    </form>
                </div>

                {/* Drawer Footer */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #f3f0ff',
                    display: 'flex', gap: 10, flexShrink: 0,
                    background: '#faf9ff',
                }}>
                    <button type="button" onClick={() => setDrawerOpen(false)} style={{
                        flex: 1, padding: '10px', borderRadius: 10,
                        border: '1px solid #e5e7eb', background: '#fff',
                        fontSize: 14, cursor: 'pointer', color: '#374151', fontWeight: 500,
                    }}>Cancel</button>

                    <button
                        type="submit" form="emp-form"
                        disabled={saving || savedOk}
                        style={{
                            flex: 2, padding: '10px', borderRadius: 10,
                            border: 'none',
                            background: savedOk ? '#22c55e' : '#4f46e5',
                            fontSize: 14, fontWeight: 600, cursor: 'pointer',
                            color: '#fff', transition: 'background 0.3s',
                            opacity: saving ? 0.8 : 1,
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 8,
                        }}>
                        {saving && <span style={{
                            width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)',
                            borderTopColor: '#fff', borderRadius: '50%',
                            animation: 'spin 0.7s linear infinite',
                            display: 'inline-block',
                        }} />}
                        {savedOk ? '✓ Saved!'
                            : saving ? 'Saving...'
                                : editMode ? 'Save Changes'
                                    : 'Create Employee'}
                    </button>
                </div>
            </div>

            <style>{`
            @keyframes fadeIn { from{opacity:0} to{opacity:1} }
            @keyframes spin   { to{transform:rotate(360deg)} }
        `}</style>
        </>
    );
}