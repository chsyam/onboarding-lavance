'use client';

import { useState } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Field, Grid, FocusInput, FocusTextarea } from '@/components/FormPrimitives';

function AddressAutocomplete({ errors, form, set }) {
    const [suggestions, setSuggestions] = useState([]);
    const places = useMapsLibrary('places');

    const handleInput = async (value) => {
        set('residential_address', value);
        setSuggestions([]);
        if (!places || value.length < 3) return;
        try {
            const { suggestions: results } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({ input: value });
            setSuggestions(results ?? []);
        } catch (err) {
            console.error('Autocomplete error:', err);
        }
    };

    const handleSelect = async (suggestion) => {
        const description = suggestion.placePrediction.text.text;
        set('residential_address', description);
        setSuggestions([]);
        try {
            const place = suggestion.placePrediction.toPlace();
            await place.fetchFields({ fields: ['addressComponents'] });
            const components = place.addressComponents ?? [];
            const get = (type) => components.find(c => c.types.includes(type))?.longText ?? '';
            const parsed = {
                addressLine1: `${get('street_number')} ${get('route')}`.trim() || description,
                city: get('locality') || get('sublocality') || get('administrative_area_level_2'),
                state: get('administrative_area_level_1'),
                country: get('country'),
                zip: get('postal_code'),
            };
            console.log('parsed:', parsed);
        } catch (err) {
            console.error('Place fetch error:', err);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <Grid cols={1}>
                <Field label="Current Residential Address" required error={errors.residential_address} span>
                    <FocusTextarea
                        value={form?.residential_address ?? ''}
                        onChange={e => handleInput(e.target.value)}
                        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                        placeholder="Start typing your address..."
                        error={errors.residential_address}
                    />
                </Field>
            </Grid>
            {suggestions.length > 0 && (
                <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: 8, zIndex: 100, listStyle: 'none', margin: 0, padding: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {suggestions.map((s, i) => (
                        <li key={i} onClick={() => {
                            e.preventDefault();
                            console.log("Handle Select")
                            handleSelect(s)
                        }}
                            style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 14, borderBottom: '1px solid #f3f4f6' }}
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
        // set('residential_address', parsed.addressLine1);
        // set('residential_city', parsed.city);
        // set('residential_state', parsed.state);
        // set('residential_country', parsed.country);
        // set('residential_zip_code', parsed.zip)
    };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <AddressAutocomplete errors={errors} form={form} set={set} />

            <Grid cols={2}>
                <Field label="City" required error={errors.residential_city}>
                    <FocusInput value={form?.residential_city ?? ''} onChange={e => set("residential_city", e.target.value)} placeholder="City" error={errors.residential_city} />
                </Field>
                <Field label="State" required error={errors.residential_state}>
                    <FocusInput value={form?.residential_state ?? ''} onChange={e => set("residential_state", e.target.value)} placeholder="State" error={errors.residential_state} />
                </Field>
                <Field label="Country" required error={errors.residential_country}>
                    <FocusInput value={form?.residential_country ?? ''} onChange={e => set("residential_country", e.target.value)} placeholder="Country" error={errors.residential_country} />
                </Field>
                <Field label="ZIP" required error={errors.residential_zip_code}>
                    <FocusInput value={form?.residential_zip_code ?? ''} onChange={e => set("residential_zip_code", e.target.value)} placeholder="ZIP Code" error={errors.residential_zip_code} />
                </Field>
            </Grid>
        </APIProvider>
    );
}