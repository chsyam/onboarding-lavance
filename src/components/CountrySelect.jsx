'use client';

import dynamic from 'next/dynamic';
import countries from "../../public/data/countries.json";
import Image from 'next/image';

const Select = dynamic(() => import('react-select'), { ssr: false });

const T = {
    border: '#d1d5db',
    borderFocus: '#1a3c34',
    error: '#ef4444',
}

const countryOptions = countries.map(c => ({
    value: c.country_name,
    label: c.country_name,
    flag: c.flag_url
}));

const formatOptionLabel = ({ label, flag }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Image src={flag} alt="" width={20} height={15} style={{ borderRadius: 2 }} />
        <span>{label}</span>
    </div>
);

export default function CountrySelect({ value, onChange, error, placeholder = 'Select country...' }) {
    return (
        <Select
            options={countryOptions}
            value={countryOptions.find(c => c.value === value) ?? null}
            onChange={selected => onChange(selected?.value ?? null)}
            formatOptionLabel={formatOptionLabel}
            placeholder={placeholder}
            isSearchable
            isClearable
            styles={{
                control: (base, state) => ({
                    ...base,
                    borderColor: error ? T.error : state.isFocused ? T.borderFocus : T.border,
                    boxShadow: state.isFocused ? '0 0 0 3px rgba(26,60,52,0.08)' : 'none',
                    '&:hover': { borderColor: error ? T.error : T.borderFocus },
                    borderRadius: 8,
                    padding: '2px 4px',
                    fontSize: 14,
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#eef2ff' : 'white',
                    color: state.isSelected ? 'white' : '#111827',
                    cursor: 'pointer',
                }),
                placeholder: base => ({ ...base, color: '#9ca3af' }),
            }}
        />
    );
}