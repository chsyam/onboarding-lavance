'use client';

import { useEffect, useState } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';

const s = {
    input: {
        width: '100%',
        padding: '10px 14px',
        fontSize: 14,
        borderRadius: 8,
        border: '1px solid #d1d5db',
        outline: 'none',
        backgroundColor: 'white',
        color: '#111827',
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
        color: '#374151',
        marginBottom: 4,
    }
}

const T = {
    primary: "#1a3c34",
    primaryHover: "#14302a",
    bg: "#f0ede8",
    bgCard: "#ffffff",
    bgSection: "#f7f5f1",
    border: "#ddd9d2",
    borderFocus: "#1a3c34",
    text: "#111827",
    textMuted: "#6b7280",
    textLight: "#9ca3af",
    error: "#c0392b",
    font: "'Libre Baskerville', Georgia, serif",
    fontSans: "'DM Sans', 'Segoe UI', sans-serif",
    checked: "#1D9E75",
    bgRow: "#f8f8f6",
    bgCheck: "#ffffff",
};

function Err({ msg }) {
    return msg ? <span style={s.errMsg}>{msg}</span> : null;
}

function FocusInput({ value, onChange, placeholder, type = "text", error, disabled }) {
    const [focus, setFocus] = useState(false);
    return (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{ ...s.input, borderColor: error ? T.error : focus ? T.borderFocus : T.border, boxShadow: focus ? "0 0 0 3px rgba(26,60,52,0.08)" : "none", background: disabled ? "#f9f9f9" : "#fff" }}
        />
    );
}

function Field({ label, required, error, children, span }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, ...(span ? { gridColumn: "1 / -1" } : {}) }}>
            {label && <label style={s.label}>{label}{required && <span style={{ color: T.error, marginLeft: 3 }}>*</span>}</label>}
            {children}
            <Err msg={error} />
        </div>
    );
}

function AddressAutocomplete({ onSelect }) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const places = useMapsLibrary('places');

    const handleInput = async (value) => {
        setInput(value);
        setSuggestions([]);

        if (!places || value.length < 3) return;

        try {
            // ✅ New API replacing AutocompleteService
            const { suggestions: results } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
                input: value,
            });

            setSuggestions(results ?? []);
        } catch (err) {
            console.error('Autocomplete error:', err);
        }
    };

    const handleSelect = async (suggestion) => {
        const description = suggestion.placePrediction.text.text;
        setInput(description);
        setSuggestions([]);

        try {
            // ✅ New API replacing Geocoder
            const place = suggestion.placePrediction.toPlace();
            await place.fetchFields({
                fields: ['addressComponents'],
            });

            const components = place.addressComponents ?? [];

            const get = (type) =>
                components.find(c => c.types.includes(type))?.longText ?? '';

            onSelect({
                addressLine1: `${get('street_number')} ${get('route')}`.trim(),
                city:
                    get('locality') ||
                    get('sublocality') ||
                    get('administrative_area_level_2'),
                state: get('administrative_area_level_1'),
                country: get('country'),
                zip: get('postal_code'),
            });
        } catch (err) {
            console.error('Place fetch error:', err);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <FocusInput
                value={input}
                onChange={e => handleInput(e.target.value)}
                placeholder="Address Line 1"
            />
            {suggestions.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    zIndex: 100,
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                    {suggestions.map((s, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelect(s)}
                            style={{
                                padding: '10px 14px',
                                cursor: 'pointer',
                                fontSize: 14,
                                borderBottom: '1px solid #f3f4f6',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            {s.placePrediction.text.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function AddressForm({ form, set, errors }) {
    const handleAddressSelect = (parsed) => {
        set('residential_address', parsed.addressLine1);
        set('residential_city', parsed.city);
        set('residential_state', parsed.state);
        set('residential_country', parsed.country);
        set('residential_zip_code', parsed.zip);
    };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <style>{css}</style>
            <Field label="Current Residential Address" required error={errors?.residential_address}>
                <AddressAutocomplete onSelect={handleAddressSelect} />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <Field label="City" required error={errors?.residential_city}>
                    <FocusInput value={form?.residential_city ?? ""} onChange={e => set('residential_city', e.target.value)} placeholder="City" error={errors?.residential_city} />
                </Field>

                <Field label="State" required error={errors?.residential_state}>
                    <FocusInput value={form?.residential_state ?? ""} onChange={e => set('residential_state', e.target.value)} placeholder="State" error={errors?.residential_state} />
                </Field>

                <Field label="Country" required error={errors?.residential_country}>
                    <FocusInput value={form?.residential_country ?? ""} onChange={e => set('residential_country', e.target.value)} placeholder="Country" error={errors?.residential_country} />
                </Field>

                <Field label="ZIP" required error={errors?.residential_zip_code}>
                    <FocusInput value={form?.residential_zip_code ?? ""} onChange={e => set('residential_zip_code', e.target.value)} placeholder="ZIP Code" error={errors?.residential_zip_code} />
                </Field>
            </div>
        </APIProvider>
    );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  .step-anim { animation: stepIn 0.3s cubic-bezier(0.22,1,0.36,1); }
  @keyframes stepIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .file-zone:hover { border-color: #1a3c34 !important; background: #eef3f2 !important; }
  .btn-primary:hover { background: #14302a !important; transform: translateY(-1px); }
  .btn-secondary:hover { background: #f7f5f1 !important; border-color: #1a3c34 !important; }
  input::placeholder, textarea::placeholder { color: #b0b8c4; }
  select option { color: #111827; }
  @media (max-width: 700px) {
    .form-card { padding: 28px 18px !important; }
    div[style*="repeat(2"] { grid-template-columns: 1fr !important; }
    div[style*="repeat(3"] { grid-template-columns: 1fr !important; }
  }
`;