import { useState } from 'react';

const T = {
    border: "#ddd9d2",
    borderFocus: "#1a3c34",
    error: "#c0392b",
    text: "#111827",
    fontSans: "'DM Sans', 'Segoe UI', sans-serif",
};

const s = {
    input: {
        width: "100%", padding: "10px 13px", fontSize: 14, border: `1px solid ${T.border}`, borderRadius: 7, fontFamily: T.fontSans, color: T.text, background: "#fff", outline: "none", transition: "border-color 0.18s, box-shadow 0.18s", boxSizing: "border-box"
    },
    label: {
        fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: "0.1px"
    },
    errMsg: {
        fontSize: 12, color: T.error, fontWeight: 500
    },
};

export function Err({ msg }) {
    return msg ? <span style={s.errMsg}>{msg}</span> : null;
}

export function FocusInput({ value, onChange, placeholder, type = "text", error, disabled }) {
    const [focus, setFocus] = useState(false);
    return (
        <input type={type} value={value ?? ''} onChange={onChange} placeholder={placeholder} disabled={disabled}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{ ...s.input, borderColor: error ? T.error : focus ? T.borderFocus : T.border, boxShadow: focus ? "0 0 0 3px rgba(26,60,52,0.08)" : "none", background: disabled ? "#f9f9f9" : "#fff" }}
        />
    );
}

export function FocusTextarea({ value, onChange, placeholder, rows = 1, error }) {
    const [focus, setFocus] = useState(false);
    return (
        <textarea
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            onFocus={() => setFocus(true)}
            onBlur={(e) => {
                setFocus(false);
                onBlur?.(e);
            }}
            style={{ ...s.input, resize: "vertical", minHeight: rows * 24, borderColor: error ? T.error : focus ? T.borderFocus : T.border, boxShadow: focus ? "0 0 0 3px rgba(26,60,52,0.08)" : "none", marginBottom: '20px' }}
        />
    );
}

export function FocusSelect({ value, onChange, children, error }) {
    const [focus, setFocus] = useState(false);
    return (
        <select value={value ?? ''} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{ ...s.input, borderColor: error ? T.error : focus ? T.borderFocus : T.border, boxShadow: focus ? "0 0 0 3px rgba(26,60,52,0.08)" : "none", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
            {children}
        </select>
    );
}

export function Field({ label, required, error, children, span }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, ...(span ? { gridColumn: "1 / -1" } : {}) }}>
            {label && <label style={s.label}>{label}{required && <span style={{ color: T.error, marginLeft: 3 }}>*</span>}</label>}
            {children}
            <Err msg={error} />
        </div>
    );
}

export function Grid({ children, cols = 2 }) {
    return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "16px 20px" }}>{children}</div>;
}