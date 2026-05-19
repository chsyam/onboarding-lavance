export default function OnboardingFormHeader() {
    return (
        <div style={{ backgroundColor: '#f0ece4', padding: '48px 32px 0', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
            <div style={{
                maxWidth: 700, margin: '0 auto',
                backgroundColor: '#fff',
                borderRadius: 12,
                border: '0.5px solid #d8d2c8',
                padding: '36px 40px 32px',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 6,
                    backgroundColor: '#1a2e25',
                }} />

                {/* Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 11, fontWeight: 500, letterSpacing: '0.8px',
                    textTransform: 'uppercase', color: '#6a8f72',
                    backgroundColor: '#eaf3e2', padding: '4px 10px',
                    borderRadius: 20, marginBottom: 16,
                }}>
                    📋 Employee Onboarding
                </div>

                <h1 style={{
                    fontSize: 26, fontWeight: 500, color: '#1a2e25',
                    lineHeight: 1.25, marginBottom: 12,
                }}>
                    Welcome to Lavance — {"let's"} get you set up
                </h1>

                <p style={{ fontSize: 14, color: '#6b6760', lineHeight: 1.65, maxWidth: 520 }}>
                    Please fill out the following details to complete your onboarding.
                    This takes about 10 minutes and your progress is saved automatically at each step.
                </p>

                {/* Meta row */}
                <div style={{
                    marginTop: 24, paddingTop: 20,
                    borderTop: '0.5px solid #e8e3da',
                    display: 'flex', alignItems: 'center', gap: 20,
                }}>
                    {[
                        { icon: '🕐', label: '~10 minutes' },
                        { icon: '✅', label: '6 steps' },
                        { icon: '🔒', label: 'Secure & encrypted' },
                    ].map((item, i) => (
                        <span key={i} style={{ fontSize: 12, color: '#9a9690', display: 'flex', gap: 6 }}>
                            {item.icon} {item.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}