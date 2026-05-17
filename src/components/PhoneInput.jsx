'use client';

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { AsYouType, parsePhoneNumberWithError } from "libphonenumber-js";
import Image from "next/image";
import countries from "../../public/data/countries.json";

const Select = dynamic(() => import("react-select"), { ssr: false });

const T = {
    border: "#d1d5db",
    borderFocus: "#1a3c34",
    error: "#ef4444",
};

const countryOptions = countries.map(c => ({
    value: c?.dial_code,           // value = dial code (e.g. "+52")
    label: c?.country_name,        // label used for search
    flag: c?.flag_url,
    dialCode: c?.dial_code,
    countryCode: c?.country_code,  // e.g. "US", "MX"
}));

// Shown inside the closed control: flag + dial code only
const formatSingleValue = ({ flag, dialCode, label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Image
            src={flag}
            alt={label}
            width={15}
            height={15}
            style={{ width: "auto", height: 15, borderRadius: 2, objectFit: "cover" }}
        />
        <div style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>
            <span style={{ textAlign: 'center' }}>{dialCode}</span>
        </div>
    </div>
);

// Shown in the dropdown menu: flag + country name + dial code
const formatOptionLabel = ({ flag, label, dialCode }, { context }) => {
    if (context === "value") {
        // This is the selected value shown in the control box
        return formatSingleValue({ flag, dialCode, label });
    }
    // This is each row in the open dropdown
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image
                src={flag}
                alt={label}
                width={20}
                height={15}
                style={{ width: "auto", height: 15, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: "inherit" }}>
                {label}
            </span>
            <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: "auto", paddingLeft: 8, flexShrink: 0 }}>
                {dialCode}
            </span>
        </div>
    );
};

export function PhoneInput({ value = "", onChange, error, disabled }) {
    const defaultOption =
        countryOptions.find(o => o.countryCode === "US") ?? countryOptions[0];

    const [selected, setSelected] = useState(defaultOption);
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleCountryChange = (option) => {
        if (!option) return;
        setSelected(option);
        // Re-format existing number with new country code
        setPhoneNumber("");
        onChange?.({ dialCode: option.dialCode, phone: "", full: option.dialCode });
    };

    const handlePhoneChange = (e) => {
        const raw = e.target.value;
        const formatter = new AsYouType(selected?.countryCode);
        const formatted = formatter.input(raw);
        setPhoneNumber(formatted);

        const rawInput = `${selected?.dialCode}${formatted}`.replace(/[^\d+]/g, "")
            .replace(/^\+?/, "+");

        onChange?.({
            dialCode: selected?.dialCode,
            phone: formatted,
            full: `${selected?.dialCode} ${formatted}`.trim(),
            rawInput
        });
    };

    return (
        <div style={{ display: "flex", gap: 5, alignItems: "stretch", width: "100%", flexWrap: "wrap" }}>
            {/* Country selector — fixed width, shows flag+code only */}
            <Select
                options={countryOptions}
                value={selected}
                onChange={handleCountryChange}
                formatOptionLabel={formatOptionLabel}
                isSearchable
                isClearable={false}
                isDisabled={disabled}
                menuPlacement="auto"
                // Filter by country name OR dial code
                filterOption={(option, inputValue) => {
                    const search = inputValue.toLowerCase();
                    return (
                        option.data.label.toLowerCase().includes(search) ||
                        option.data.dialCode.includes(search)
                    );
                }}
                styles={{
                    container: (base) => ({
                        ...base,
                        flexShrink: 0,
                    }),
                    control: (base, state) => ({
                        ...base,
                        height: "100%",
                        minHeight: 44,
                        borderColor: error ? T.error : state.isFocused ? T.borderFocus : T.border,
                        boxShadow: state.isFocused ? "0 0 0 3px rgba(26,60,52,0.08)" : "none",
                        "&:hover": { borderColor: error ? T.error : T.borderFocus },
                        padding: "2px 2px",
                        fontSize: 13,
                        cursor: "pointer",
                        backgroundColor: disabled ? "#f9fafb" : "white",
                    }),
                    valueContainer: (base) => ({
                        ...base,
                        padding: "0 4px",
                        flexWrap: "nowrap",
                    }),
                    singleValue: (base) => ({
                        ...base,
                        margin: 0,
                        overflow: "visible",
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        padding: "0 4px",
                        color: "#6b7280",
                    }),
                    indicatorSeparator: () => ({ display: "none" }),
                    menu: (base) => ({
                        ...base,
                        // Menu can be wider than the control to fit country names
                        width: 280,
                        minWidth: 280,
                        borderRadius: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        overflow: "hidden",
                        zIndex: 9999,
                    }),
                    menuList: (base) => ({
                        ...base,
                        maxHeight: 240,   // fixed dropdown height
                        padding: "4px 0",
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                            ? "#1a3c34"
                            : state.isFocused
                                ? "#f0fdf4"
                                : "white",
                        color: state.isSelected ? "white" : "#111827",
                        cursor: "pointer",
                        padding: "8px 12px",
                    }),
                    input: (base) => ({
                        ...base,
                        fontSize: 13,
                    }),
                    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
                }}
            />

            {/* Phone number input */}
            <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                disabled={disabled}
                placeholder="(555) 000-0000"
                style={{
                    flex: 1,
                    height: 44,
                    border: `1px solid ${error ? T.error : T.border}`,
                    borderRadius: "8px 8px",
                    padding: "0 12px",
                    fontSize: 14,
                    color: "#111827",
                    outline: "none",
                    backgroundColor: disabled ? "#f9fafb" : "white",
                    transition: "border-color 0.15s",
                }}
                onFocus={e => {
                    e.target.style.borderColor = error ? T.error : T.borderFocus;
                    e.target.style.boxShadow = "0 0 0 3px rgba(26,60,52,0.08)";
                }}
                onBlur={e => {
                    e.target.style.borderColor = error ? T.error : T.border;
                    e.target.style.boxShadow = "none";
                }}
            />
        </div>
    );
}