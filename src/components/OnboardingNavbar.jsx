export default function OnboardingNavbar() {
    return (
        <nav style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 32px', height: '60px',
            backgroundColor: '#1a2e25',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: '#c8a96e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 500, fontSize: 13, color: '#1a2e25',
                }}>L</div>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#f0ebe2' }}>
                    Lavance LLC
                </span>
            </div>

            <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: '#a8c4b0', cursor: 'pointer',
                padding: '6px 12px', borderRadius: 6,
                border: '0.5px solid rgba(168,196,176,0.3)',
                background: 'transparent',
            }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" />
                </svg>
                Help
            </button>
        </nav>
    );
}