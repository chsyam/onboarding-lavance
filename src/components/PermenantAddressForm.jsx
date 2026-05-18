'use client';

import { useState } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Field, FocusInput } from './FormPrimitives';

function AddressAutocomplete({ onSelect, errors }) {
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
                error={errors.permanent_address}
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

export default function PermenantAddressForm({ form, set, errors, isSame }) {
    const handleAddressSelect = (parsed) => {
        set('permanent_address', parsed.addressLine1);
        set('permanent_city', parsed.city);
        set('permanent_state', parsed.state);
        set('permanent_country', parsed.country);
        set('permanent_zip_code', parsed.zip);
    };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <style>{css}</style>
            {
                isSame ? (
                    <Field label="Permanent Address" required={!isSame} error={errors.permanent_address} span>
                        <FocusInput value={form?.permanent_address} onChange={e => set("permanent_address", e.target.value)} placeholder="Address Line 1" error={errors.permanent_address} disabled={isSame} />
                    </Field>
                ) : (
                    <Field label="Permanent Address" required error={errors?.permanent_address}>
                        <AddressAutocomplete onSelect={handleAddressSelect} errors={errors} />
                    </Field>
                )
            }
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <Field label="City" required={!isSame} error={errors.permanent_city}>
                    <FocusInput value={form?.permanent_city ?? ""} onChange={e => set("permanent_city", e.target.value)} placeholder="City" error={errors.permanent_city} disabled={isSame} />
                </Field>

                <Field label="State" required={!isSame} error={errors.permanent_state}>
                    <FocusInput value={form?.permanent_state ?? ""} onChange={e => set("permanent_state", e.target.value)} placeholder="State" error={errors.permanent_state} disabled={isSame} />
                </Field>
                <Field label="Country" required={!isSame} error={errors.permanent_country}>
                    <FocusInput value={form?.permanent_country} onChange={e => set("permanent_country", e.target.value)} placeholder="Country" error={errors.permanent_country} disabled={isSame} />
                </Field>
                <Field label="ZIP" required={!isSame} error={errors.permanent_zip_code}>
                    <FocusInput value={form?.permanent_zip_code} onChange={e => set("permanent_zip_code", e.target.value)} placeholder="ZIP Code" error={errors.permanent_zip_code} disabled={isSame} />
                </Field>
            </div>
        </APIProvider >
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