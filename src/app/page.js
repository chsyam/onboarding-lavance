"use client";

import { useState, useRef, useEffect } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { RotatingLines } from "react-loader-spinner";
import Link from "next/link";
import CountrySelect from "@/components/CountrySelect";
import { isValidPhoneNumber } from 'libphonenumber-js';
import relations from "../../public/data/relations.json";
import AddressForm from "./address/page";

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

const STEPS = [
	{ id: 1, label: "Personal Info" },
	{ id: 2, label: "Work Authorization" },
	{ id: 3, label: "Education" },
	{ id: 4, label: "Payroll & Tax" },
	{ id: 5, label: "Document Upload" },
	{ id: 6, label: "Review & Submit" },
];

const INIT = {
	userId: "", employeeId: "", firstName: "", lastName: "", preferredName: "", dob: "", gender: "", nationality: "", maritalStatus: "", personalEmail: "", alternativeEmail: "", mobileNumber: "", alternativeNumber: "", emergencyContactName: "", emergencyNumber: "", relationToEmployee: "", relationSelected: "", residential_address: "", residential_city: "", residential_state: "", residential_zip_code: "", residential_country: "", is_address_same: null, permanent_address: "", permanent_city: "", permanent_state: "", permanent_zip_code: "", permanent_country: "", ssn: "", workAuthStatus: "", visaType: "", visaExpiry: "", passportNumber: "", passportExpiry: "", countryOfIssue: "", i94: "", highestQualification: "", degreeName: "", specialization: "", universityName: "", graduationYear: "", gpa: "", accountHolderName: "", bankName: "", routingNumber: "", confirmRoutingNumber: "", accountNumber: "", confirmAccountNumber: "", accountType: "", docPassport: null, docSSN: null, docVisa: null, docDegree: null, docVoidCheck: null, docI94: null, docw4: null, docOfferLetter: null, passport_url: "", ssn_url: "", visa_url: "", degree_url: "", void_check_url: "", i94_url: "", w4_url: "", offer_letter_url: "",
};

const modalStyles = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	color: 'text.primary',
	border: "none",
	outline: "none",
	borderRadius: 2,
	fontFamily: T.fontSans,
	textAlign: "center",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
};

function TokenValidation({ open, tokenError }) {
	return (
		<div>
			<Modal open={open}>
				<Box sx={modalStyles}>
					{
						tokenError ? (
							<div style={{ margin: "5px auto" }}>
								Oops! This onboarding link is invalid, has expired, or has already been used. Please reach out to your HR administrator or send out an email to
								<Link href="mailto:hr@lavancegroup.com" style={{ margin: "auto 5px", color: "blue" }}>hr@lavancegroup.com</Link>
								for a new access link.
							</div>
						) : (
							<Box sx={modalStyles}>
								<RotatingLines
									visible={true}
									height="96"
									width="96"
									color="grey"
									strokeWidth="5"
									animationDuration="1"
									ariaLabel="rotating-lines-loading"
									wrapperStyle={{}}
									wrapperClass=""
								/>
								<div style={{ margin: "5px auto" }}>
									Validating your token. Please wait a moment...
								</div>
							</Box>
						)
					}
				</Box>
			</Modal>
		</div >
	);
}

// ─── Primitives ───────────────────────────────────────────────────────────────
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

function SameAddressCheckbox({ checked, onChange, error }) {
	return (
		<div style={{ margin: "20px 0" }}>
			<button type="button" onClick={onChange} style={s.checkRow} aria-pressed={checked}>
				<span style={{ ...s.checkBox, background: checked ? T.checked : T.bgCheck, borderColor: checked ? T.checked : T.border }}>
					{checked && (
						<svg width="11" height="9" viewBox="0 0 11 9" fill="none">
							<path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					)}
				</span>
				<span style={s.checkLabel}>Permanent address is same as current residential address</span>
			</button>
			<Err msg={error} />
		</div>
	);
}

function FocusSelect({ value, onChange, children, error }) {
	const [focus, setFocus] = useState(false);
	return (
		<select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
			style={{ ...s.input, borderColor: error ? T.error : focus ? T.borderFocus : T.border, boxShadow: focus ? "0 0 0 3px rgba(26,60,52,0.08)" : "none", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
			{children}
		</select>
	);
}

function FocusTextarea({ value, onChange, placeholder, rows = 1, error }) {
	const [focus, setFocus] = useState(false);
	return (
		<textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
			onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
			style={{ ...s.input, resize: "vertical", minHeight: rows * 24, borderColor: error ? T.error : focus ? T.borderFocus : T.border, boxShadow: focus ? "0 0 0 3px rgba(26,60,52,0.08)" : "none", marginBottom: '20px' }}
		/>
	);
}

function RadioGroup({ options, value, onChange, error }) {
	return (
		<div>
			<div style={s.radioGroup}>
				{options.map((opt) => (
					<label key={opt.value} style={{ ...s.radioItem, ...(value === opt.value ? s.radioItemActive : {}) }}>
						<input type="radio" value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} style={{ display: "none" }} />
						<span style={{ ...s.radioDot, ...(value === opt.value ? s.radioDotActive : {}) }} />
						<span style={s.radioLabel}>{opt.label}</span>
					</label>
				))}
			</div>
			<Err msg={error} />
		</div>
	);
}

function FileUpload({ label, file, onChange, accept, hint }) {
	const ref = useRef();
	return (
		<div style={s.fileZone} onClick={() => ref.current.click()} className="file-zone">
			<input ref={ref} type="file" accept={accept} style={{ display: "none" }}
				onChange={e => onChange(e.target.files[0] ?? null)} />
			{file ? (
				<div style={s.fileList}>
					<span style={{ fontSize: 22 }}>📎</span>
					<div>
						<p style={s.fileName}>{file.name}</p>
						<p style={s.fileChange}>Click to change</p>
					</div>
				</div>
			) : (
				<div style={s.fileEmpty}>
					<span style={{ fontSize: 20, color: T.primary, fontWeight: 700 }}>↑</span>
					<span style={{ fontSize: 13, fontWeight: 600, color: T.primary }}>{label}</span>
					{hint && <span style={{ fontSize: 12, color: T.textMuted }}>{hint}</span>}
				</div>
			)}
		</div>
	);
}

function SecHead({ children }) {
	return <h3 style={s.sectionHeading}>{children}</h3>;
}

function Grid({ children, cols = 2 }) {
	return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "16px 20px" }}>{children}</div>;
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

function Divider() {
	return <div style={{ borderTop: `1px solid ${T.border}`, margin: "24px 0" }} />;
}

function ReviewRow({ label, value }) {
	if (!value) return null;
	return (
		<div style={s.reviewRow}>
			<span style={s.reviewLabel}>{label}</span>
			<span style={s.reviewValue}>{value}</span>
		</div>
	);
}

function ReviewSection({ title, children }) {
	return (
		<div style={s.reviewSection}>
			<p style={s.reviewTitle}>{title}</p>
			{children}
		</div>
	);
}

function LoadingScreen({ isLoading }) {
	return (
		<div>
			<Modal open={isLoading}>
				<Box sx={modalStyles}>
					<Box sx={modalStyles}>
						<RotatingLines
							visible={true}
							height="96"
							width="96"
							color="grey"
							strokeWidth="5"
							animationDuration="1"
							ariaLabel="rotating-lines-loading"
							wrapperStyle={{}}
							wrapperClass=""
						/>
						<div style={{ margin: "5px auto" }}>
							Saving the data. Please wait a moment...
						</div>
					</Box>
				</Box>
			</Modal>
		</div>
	);
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(step, form) {
	const e = {};
	const req = (f, msg) => {
		if (!form[f]?.toString().trim())
			e[f] = msg || "This field is required";
	};

	if (step === 1) {
		req("firstName"); req("lastName"); req("gender"); req("dob");
		req("nationality"); req("maritalStatus"); req("personalEmail"); req("mobileNumber"); req("emergencyNumber"); req("emergencyContactName"); req("relationToEmployee"); req("residential_address"); req("residential_city"); req("residential_state"); req("residential_zip_code"); req("residential_country"); req("is_address_same");
		if (!form?.is_address_same) {
			req("permanent_address");
			req("permanent_city");
			req("permanent_state");
			req("permanent_zip_code");
			req("permanent_country");
		}
		if (!form?.personalEmail || !/\S+@\S+\.\S+/.test(form?.personalEmail)) e.personalEmail = "Enter a valid email address";

		if (!form?.mobileNumber === form?.alternativeNumber) {
			e.alternativeNumber = "Alternative number must be different from mobile number";
		}

		if (!form?.emergencyNumber && (!form?.emergencyNumber === form?.mobileNumber || form?.emergencyNumber === !form?.alternativeNumber)) {
			e.emergencyNumber = "Emergency contact number must be different from personal mobile and alternative numbers";
		}

		if (form?.dob) {
			const dob = new Date(form?.dob);
			const today = new Date();
			const diffMs = today - dob;

			if (isNaN(dob.getTime())) e.dob = "Invalid date";
			else if (diffMs < 0) e.dob = "Date of birth must be in the past";
			else {
				const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
				if (diffDays < (18 * 365.25))
					e.dob = "You must be at least 18 years old";
			}
		}

		if (form?.mobileNumber) {
			try {
				const fullNumber = `${form.mobileNumber.replace(/\s+/g, '')}`;

				const validNumber = isValidPhoneNumber(fullNumber);
				if (!validNumber) e.mobileNumber = 'Invalid Mobile number';
			} catch (error) {
				console.log(error);
				e.mobileNumber = 'Invalid Mobile number'
			}
		}
		if (form?.alternativeNumber) {
			try {
				const fullNumber = `${form.alternativeNumber.replace(/\s+/g, '')}`;
				const validNumber = isValidPhoneNumber(fullNumber);
				if (!validNumber) e.alternativeNumber = 'Invalid alternative mobile number';
			} catch (error) {
				console.log(error);
				e.alternativeNumber = 'Invalid alternative mobile number'
			}
		}
		if (form?.emergencyNumber) {
			try {
				const fullNumber = `${form.emergencyNumber.replace(/\s+/g, '')}`;
				const validNumber = isValidPhoneNumber(fullNumber);
				if (!validNumber) e.emergencyNumber = 'Invalid Emergency Number';
			} catch (error) {
				console.log(error);
				e.emergencyNumber = 'Invalid Emergency Number'
			}
		}
	}
	if (step === 2) {
		req("ssn"); req("workAuthStatus");

		if (form?.workAuthStatus === "visa") {
			req("visaType"); req("visaExpiry");
		}

		if (["visa", "pr"].includes(form?.workAuthStatus)) {
			req("passportNumber"); req("passportExpiry"); req("countryOfIssue");
		}

		if (form?.workAuthStatus !== "citizen" && !form?.docPassport)
			e.docPassport = "Please upload passport copy";
		if (!form?.docSSN)
			e.docSSN = "Please upload SSN card copy";
		if (form?.workAuthStatus === "visa" && !form?.docVisa)
			e.docVisa = "Please upload visa copy";
	}
	if (step === 3) {
		req("highestQualification"); req("degreeName"); req("universityName"); req("graduationYear"); req("gpa"); req("specialization");
		if (!form?.docDegree)
			e.docDegree = "Please upload your latest degree certificate or transcript";
	}
	if (step === 4) {
		req("accountHolderName"); req("bankName"); req("routingNumber"); req("confirmRoutingNumber"); req("accountNumber"); req("confirmAccountNumber"); req("accountType");
		if (!form?.docVoidCheck)
			e.docVoidCheck = "Please upload Void/Cancellation check";
		if (form?.accountNumber !== form?.confirmAccountNumber)
			e.confirmAccountNumber = "Account number and confirm account number must match";
		if (form?.routingNumber !== form?.confirmRoutingNumber)
			e.confirmRoutingNumber = "Routing number and confirm routing number must match";
	}
	if (step === 5) {
		if (!form?.docI94)
			e.docI94 = "I-94 document is required";
		if (!form?.docw4)
			e.docw4 = "W4 document is required";
		if (!form?.docOfferLetter)
			e.docOfferLetter = "Offer letter acknowledgement is required";
	}

	return e || {};
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OnboardingForm() {
	const [step, setStep] = useState(1);
	const [form, setForm] = useState(INIT);
	const [errors, setErrors] = useState({});
	const [submitted, setSubmitted] = useState(false);
	const [isSame, setIsSame] = useState(false);
	const [open, setOpen] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [tokenError, setTokenError] = useState(false);

	const set = (field, value) => {
		console.log(field, value);

		setForm(f => ({ ...f, [field]: value }));
		setErrors(e => ({ ...e, [field]: undefined }));
	};

	const goNext = () => {
		const e = validate(step, form);
		setErrors(e);
		if (!Object.keys(e)?.length) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
	};

	const goBack = () => {
		setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const validateToken = async (token) => {
		if (!token) {
			throw new Error("No token provided");
		}
		const response = await fetch(`/api/admin/token_validation/${token}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		// console.log(data);
		return data;
	}

	useEffect(() => {
		let isMounted = true;
		const params = new URLSearchParams(window.location.search);
		const urlToken = params.get("token");

		validateToken(urlToken).then((data) => {
			if (isMounted && data?.data) {
				const token_user = data.data;
				set("firstName", token_user?.first_name);
				set("lastName", token_user?.last_name);
				set("personalEmail", token_user?.email);
				set("employeeId", token_user?.employee_id);
				set("userId", token_user?.id);
				setOpen(false);
				setTokenError(false);
			} else {
				console.log("Token validation failed:", data?.message || "Unknown error");
				setTokenError(true);
			}
		}).catch((err) => {
			console.log("Token validation error:", err);
			setTokenError(true);
		});

		return () => {
			isMounted = false;
		};
	}, []);

	const handleSubmit = async () => {
		const e = validate(step, form);
		setErrors(e);

		if (!Object.keys(e)?.length) {
			setIsLoading(true);
			await saveEmployeeData();
		};
	};

	const updateTokenStatus = async (userId) => {
		try {
			const response = await fetch("/api/admin/employees/update-token-status", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userId,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Token status updated successfully", data);
			} else {
				console.error("Failed to update token status", data);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	}

	const sendOnboardingDetailsToHR = async (form) => {
		try {
			const response = await fetch("/api/emails/onboarding/onboarding-details-to-hr", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					onboarding_form: form,
					employeeId: form?.employeeId,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Email sent successfully", data);
			} else {
				console.error("Failed", data);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	}

	const sendSubmissionSuccessEmail = async (candidate_email, first_name, last_name) => {
		try {
			const response = await fetch("/api/emails/onboarding/submission-success", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					candidateEmail: candidate_email,
					candidateName: `${first_name} ${last_name}`,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Email sent successfully", data);
			} else {
				console.error("Failed", data);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const saveAddressInfo = async (employeeId) => {
		console.log(form);
		try {
			const response = await fetch(`/api/employees/address/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					employeeId: employeeId,
					residential_address: form?.residential_address || "",
					residential_city: form?.residential_city || "",
					residential_state: form?.residential_state || "",
					residential_zip_code: form?.residential_zip_code || "",
					residential_country: form?.residential_country || "",
					is_address_same: form?.is_address_same,
					permanent_address: form?.permanent_address || "",
					permanent_city: form?.permanent_city || "",
					permanent_state: form?.permanent_state || "",
					permanent_zip_code: form?.permanent_zip_code || "",
					permanent_country: form?.permanent_country || "",
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Address info saved successfully", data.insertId);

				return {
					employeeId: employeeId,
					insertId: data.insertId,
					message: "Address info saved successfully"
				}
			} else {
				console.error("Failed", data.error);

				return {
					employeeId: employeeId,
					insertId: null,
					message: data.error || "Failed to save address info"
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const saveEducationInfo = async (employeeId) => {
		try {
			const response = await fetch(`/api/employees/education/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					employeeId: employeeId,
					highestQualification: form?.highestQualification || "",
					degreeName: form?.degreeName || "",
					specialization: form?.specialization || "",
					university: form?.universityName || "",
					graduatedYear: form?.graduationYear || "",
					grade: form?.grade || "",
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Education info saved successfully", data.insertId);

				return {
					employeeId: employeeId,
					insertId: data.insertId,
					message: "Education info saved successfully"
				}
			} else {
				console.error("Failed", data.error);

				return {
					employeeId: employeeId,
					insertId: null,
					message: data.error || "Failed to save education info"
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const savePayrollTaxInfo = async (employeeId) => {
		try {
			const response = await fetch(`/api/employees/payroll_tax_info/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					employeeId: employeeId,
					accountHolderName: form?.accountHolderName || "",
					bankName: form?.bankName || "",
					routingNumber: form?.routingNumber || "",
					accountNumber: form?.accountNumber || "",
					accountType: form?.accountType || "",
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Payroll & Tax info saved successfully");

				return {
					employeeId: employeeId,
					insertId: data.insertId,
					message: "Payroll & Tax info saved successfully"
				}
			} else {
				console.error("Failed", data.error);

				return {
					employeeId: employeeId,
					insertId: null,
					message: data.error || "Failed to save payroll & tax info"
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const saveWorkAuthorizationInfo = async (employeeId) => {
		try {
			const response = await fetch(`/api/employees/work_authorization/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					employeeId: employeeId,
					ssn: form?.ssn || "",
					work_auth_status: form?.workAuthStatus || "",
					visaType: form?.visaType || "",
					visa_expiry_dt: form?.visaExpiry || "",
					passport_number: form?.passportNumber || "",
					country_of_issue: form?.countryOfIssue || "",
					passport_expiry_date: form?.passportExpiry || "",
					i94: form?.i94 || "",
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Work Authorization info saved successfully");

				return {
					employeeId: employeeId,
					insertId: data.insertId,
					message: "Work Authorization info saved successfully"
				}
			} else {
				console.error("Failed", data.error);

				return {
					employeeId: employeeId,
					insertId: null,
					message: data.error || "Failed to save work authorization info"
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const saveDocumentsInfo = async (employeeId) => {
		try {
			await Promise.all(
				[["docPassport", "passport_url"], ["docSSN", "ssn_url"], ["docVisa", "visa_url"], ["docDegree", "degree_url"], ["docVoidCheck", "void_check_url"], ["docI94", "i94_url"], ["docw4", "w4_url"], ["docOfferLetter", "offer_letter_url"]]?.map(async ([field, url]) => {
					try {
						const file = form[field] || null;

						if (!file) {
							console.log("No file provided for", field);
							return;
						}

						const formData = new FormData();
						formData.append("file", file);
						formData.append("employee_id", form?.employeeId || "");

						const fileUploadResponse = await fetch("/api/upload", {
							method: "POST",
							body: formData,
						});

						if (!fileUploadResponse.ok) {
							throw new Error(`Upload failed for ${field}: ${fileUploadResponse.statusText}`);
						}

						const data = await fileUploadResponse.json();
						console.log(`${field} uploaded:`, data.fileUrl);
						set(url, data.fileUrl);
					} catch (err) {
						console.error(`Error uploading ${field}:`, err.message);
						throw err;
					}
				})
			);
		} catch (error) {
			console.error("Error uploading documents:", error);
		}

		try {
			const response = await fetch(`/api/employees/documents/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					employeeId: employeeId,
					passport_url: form?.passport_url || "",
					visa_url: form?.visa_url || "",
					ssn_url: form?.ssn_url || "",
					void_check_url: form?.void_check_url || "",
					i94_url: form?.i94_url || "",
					w4_url: form?.w4_url || "",
					latest_degree_certificate_url: form?.degree_url || "",
					offer_acknowledgement_url: form?.offer_letter_url || "",
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Documents info saved successfully");

				return {
					employeeId: employeeId,
					insertId: data.insertId,
					message: "Documents info saved successfully"
				}
			} else {
				console.error("Failed", data.error);

				return {
					employeeId: employeeId,
					insertId: null,
					message: data.error || "Failed to save documents info"
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const saveEmployeeData = async () => {
		try {
			const response = await fetch("/api/employees/personal_info", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: form?.userId || null,
					firstName: form?.firstName || "",
					lastName: form?.lastName || "",
					preferredName: form?.preferredName || "",
					dob: form?.dob || "",
					gender: form?.gender || "",
					nationality: form?.nationality || "",
					maritalStatus: form?.maritalStatus || "",
					personalEmail: form?.personalEmail || "",
					alternativeEmail: form?.alternativeEmail || "",
					mobileNumber: form?.mobileNumber || "",
					alternativeNumber: form?.alternativeNumber || "",
					emergencyContactName: form?.emergencyContactName || "",
					emergencyNumber: form?.emergencyNumber || "",
					relationToEmployee: form?.relationToEmployee || "",
				}),
			});

			const data = await response.json();
			console.log("Personal info response:", data);

			if (response.ok && data.insertId) {
				console.log("Personal info saved successfully");

				const address_result = await saveAddressInfo(data.insertId);
				if (!address_result?.insertId) {
					console.error("Address info failed to save for employeeId:", address_result.employeeId, "message:", address_result.message);
				}

				const education_result = await saveEducationInfo(data.insertId);
				if (!education_result?.insertId) {
					console.error("Education info failed to save for employeeId:", education_result.employeeId, "message:", education_result.message);
				}

				const work_authorization_result = await saveWorkAuthorizationInfo(data.insertId);
				if (!work_authorization_result?.insertId) {
					console.error("Work authorization info failed to save for employeeId:", work_authorization_result.employeeId, "message:", work_authorization_result.message);
				}

				const payroll_tax_result = await savePayrollTaxInfo(data.insertId);
				if (!payroll_tax_result?.insertId) {
					console.error("Payroll tax info failed to save for employeeId:", payroll_tax_result.employeeId, "message:", payroll_tax_result.message);
				}

				const documents_result = await saveDocumentsInfo(data.insertId);
				if (!documents_result?.insertId) {
					console.error("Documents info failed to save for employeeId:", documents_result.employeeId, "message:", documents_result.message);
				}

				if (data?.insertId && address_result?.insertId && education_result?.insertId && work_authorization_result?.insertId && payroll_tax_result?.insertId && documents_result?.insertId) {
					console.log("All info saved successfully");
					await sendSubmissionSuccessEmail(
						form?.personalEmail,
						form?.firstName,
						form?.lastName
					);
					await sendOnboardingDetailsToHR(form);
					await updateTokenStatus(form?.userId);
					setIsLoading(false);
					setSubmitted(true);
				} else {
					console.error("Some info failed to save.")
				}
			} else {
				console.error("Failed", data.error);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	if (submitted) {
		return (
			<>
				<style>{css}</style>
				<div style={s.page}>
					<div style={{ ...s.card, textAlign: "center", padding: "64px 48px" }}>
						<div style={s.successBadge}>✓</div>
						<h2 style={{ ...s.cardTitle, marginBottom: 12 }}>Submission Received</h2>
						<p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 28px" }}>
							Thank you <strong>{form?.firstName || ""} {form?.lastName || ""}</strong>. Your onboarding information has been submitted. Our HR team will review your documents and be in touch at <strong>{form?.personalEmail}</strong> within 1-2 business days.
						</p>
					</div>
				</div>
			</>
		);
	}

	const handleAddressChange = () => {
		setIsSame(!isSame);
		set("is_address_same", !isSame);
		if (!isSame) {
			setErrors(e => {
				const updated = { ...e };
				delete updated.permanent_address;
				delete updated.permanent_city;
				delete updated.permanent_state;
				delete updated.permanent_zip_code;
				delete updated.permanent_country;
				return updated;
			});
		}
	}

	const progress = ((step - 1) / (STEPS?.length - 1)) * 100;

	return (
		<>
			<TokenValidation open={open} tokenError={tokenError} />
			<LoadingScreen isLoading={isLoading} />
			<style>{css}</style>
			<div style={s.page}>

				{/* Top progress line */}
				<div style={s.progressWrap}>
					<div style={{ ...s.progressBar, width: `${progress}%` }} />
				</div>

				{/* Step nav */}
				<div style={s.stepNav}>
					{STEPS.map((st) => (
						<div key={st.id} style={s.stepNavItem}>
							<div style={{ ...s.stepDot, ...(step === st.id ? s.stepDotActive : {}), ...(step > st.id ? s.stepDotDone : {}) }}>
								{step > st.id ? "✓" : st.id}
							</div>
							<span style={{ ...s.stepNavLabel, ...(step === st.id ? { color: T.primary, fontWeight: 700 } : {}) }}>{st.label}</span>
						</div>
					))}
				</div>

				{/* Main card */}
				<div style={s.card} className="form-card">
					<div style={s.cardHeader}>
						<span style={s.cardStep}>Step {step} of {STEPS?.length}</span>
						<h2 style={s.cardTitle}>{STEPS?.[step - 1]?.label}</h2>
					</div>

					{/* ── Step 1 ── */}
					{step === 1 && (
						<div className="step-anim">
							<Grid cols={2}>
								<Field label="First Name" required error={errors.firstName}>
									<FocusInput value={form?.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Exactly as per passport / government ID" error={errors.firstName} />
								</Field>
								<Field label="Last Name" required error={errors.lastName}>
									<FocusInput value={form?.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Exactly as per passport / government ID" error={errors.lastName} />
								</Field>
								<Field label="Preferred / Display Name" error={errors.preferredName}>
									<FocusInput value={form?.preferredName} onChange={e => set("preferredName", e.target.value)} placeholder="What you'd like to be called" error={errors.preferredName} />
								</Field>
								<Field label="Date of Birth" required error={errors.dob}>
									<FocusInput type="date" value={form?.dob} onChange={e => set("dob", e.target.value)} error={errors.dob} />
								</Field>
								<Field label="Gender" required error={errors.gender}>
									<FocusSelect value={form?.gender} onChange={e => set("gender", e.target.value)} error={errors.gender}>
										<option value="">Select</option>
										<option>Male</option>
										<option>Female</option>
										<option>Prefer not to say</option>
										<option>Other</option>
									</FocusSelect>
								</Field>
								<Field label="Nationality / Citizenship" required error={errors.nationality}>
									<CountrySelect
										value={form?.nationality}
										onChange={val => set("nationality", val)}
										error={errors.nationality}
									/>
								</Field>
								<Field label="Marital Status" required error={errors.maritalStatus}>
									<FocusSelect value={form?.maritalStatus} onChange={e => set("maritalStatus", e.target.value)} error={errors.maritalStatus}>
										<option value="">Select</option>
										<option>Single</option>
										<option>Married</option>
										<option>Divorced</option>
									</FocusSelect>
								</Field>
								<Field label="Personal Email Address" required error={errors.personalEmail}>
									<FocusInput type="email" value={form?.personalEmail} onChange={e => set("personalEmail", e.target.value)} placeholder="your@email.com" error={errors.personalEmail} />
								</Field>
								<Field label="Alternative Email Address" error={errors.alternativeEmail}>
									<FocusInput type="email" value={form?.alternativeEmail} onChange={e => set("alternativeEmail", e.target.value)} placeholder="your@email.com" error={errors.alternativeEmail} />
								</Field>
								<Field label="Mobile Number" required error={errors.mobileNumber}>
									<FocusInput value={form?.mobileNumber} onChange={e => set("mobileNumber", e.target.value)} placeholder="+1 (555) 000-0000" error={errors.mobileNumber} />
								</Field>
								<Field label="Alternative Contact Number" error={errors.alternativeNumber}>
									<FocusInput value={form?.alternativeNumber} onChange={e => set("alternativeNumber", e.target.value)} placeholder="+1 (555) 000-0000" error={errors.alternativeNumber} />
								</Field>
							</Grid>
							<Divider />
							<Grid cols={2}>
								<Field label="Emergency Contact Name" required error={errors.emergencyContactName}>
									<FocusInput value={form?.emergencyContactName} onChange={e => set("emergencyContactName", e.target.value)} placeholder="Emergency Contact Name" error={errors.emergencyContactName} />
								</Field>
								<Field label="Emergency Contact Number" required error={errors.emergencyNumber}>
									<FocusInput value={form?.emergencyNumber} onChange={e => set("emergencyNumber", e.target.value)} placeholder="+1 (555) 000-0000" error={errors.emergencyNumber} />
								</Field>
								<Field label="Relationship to employee" required error={errors.relationToEmployee}>
									<FocusSelect value={form?.relationToEmployee || form?.relationSelected} onChange={e => {
										set("relationToEmployee", e.target.value !== 'other' ? e.target.value : "");
										set("relationSelected", e.target.value)
									}} error={errors.relationToEmployee}>
										<option value="">Select</option>
										{
											relations?.map((relation, index) => (
												<option key={index} value={relation.value}>
													{relation.label}
												</option>
											))
										}
									</FocusSelect>
									{
										form?.relationSelected === 'other' && (
											<FocusInput value={form?.relationToEmployee} onChange={e => set("relationToEmployee", e.target.value)} placeholder="Relationship to employee" error={errors.relationToEmployee} />
										)
									}
								</Field>
							</Grid>
							<Divider />
							{/* <Grid cols={1}>
								<Field label="Current Residential Address" required error={errors.residential_address} span>
									<FocusTextarea value={form?.residential_address} onChange={e => set("residential_address", e.target.value)} placeholder="Address Line 1" error={errors.residential_address} />
								</Field>
							</Grid>
							<Grid cols={2}>
								<Field label="City" required error={errors.residential_city}>
									<FocusInput value={form?.residential_city} onChange={e => set("residential_city", e.target.value)} placeholder="City" error={errors.residential_city} />
								</Field>
								<Field label="State" required error={errors.residential_state}>
									<FocusInput value={form?.residential_state} onChange={e => set("residential_state", e.target.value)} placeholder="State" error={errors.residential_state} />
								</Field>
								<Field label="Country" required error={errors.residential_country}>
									<FocusInput value={form?.residential_country} onChange={e => set("residential_country", e.target.value)} placeholder="Country" error={errors.residential_country} />
								</Field>
								<Field label="ZIP" required error={errors.residential_zip_code}>
									<FocusInput value={form?.residential_zip_code} onChange={e => set("residential_zip_code", e.target.value)} placeholder="ZIP Code" error={errors.residential_zip_code} />
								</Field>
							</Grid> */}

							<AddressForm set={set} form={form} errors={errors} />

							<SameAddressCheckbox checked={isSame} onChange={() => handleAddressChange()} error={errors.is_address_same} />
							<Grid cols={1}>
								<Field label="Permanent Address" required={!isSame} error={errors.permanent_address} span>
									<FocusTextarea value={isSame ? form?.residential_address : form?.permanent_address} onChange={e => set("permanent_address", e.target.value)} placeholder="Address Line 1" error={errors.permanent_address} />
								</Field>
							</Grid>
							<Grid cols={2}>
								<Field label="City" required={!isSame} error={errors.permanent_city}>
									<FocusInput value={isSame ? form?.residential_city : form?.permanent_city} onChange={e => set("permanent_city", e.target.value)} placeholder="City" error={errors.permanent_city} />
								</Field>
								<Field label="State" required={!isSame} error={errors.permanent_state}>
									<FocusInput value={isSame ? form?.residential_state : form?.permanent_state} onChange={e => set("permanent_state", e.target.value)} placeholder="State" error={errors.permanent_state} />
								</Field>
								<Field label="Country" required={!isSame} error={errors.permanent_country}>
									<FocusInput value={isSame ? form?.residential_country : form?.permanent_country} onChange={e => set("permanent_country", e.target.value)} placeholder="Country" error={errors.permanent_country} />
								</Field>
								<Field label="ZIP" required={!isSame} error={errors.permanent_zip_code}>
									<FocusInput value={isSame ? form?.residential_zip_code : form?.permanent_zip_code} onChange={e => set("permanent_zip_code", e.target.value)} placeholder="ZIP Code" error={errors.permanent_zip_code} />
								</Field>
							</Grid>
						</div>
					)}

					{/* ── Step 2 ── */}
					{step === 2 && (
						<div className="step-anim">
							<Grid cols={2}>
								<Field label="Social Security Number (SSN)" required error={errors.ssn}>
									<FocusInput value={form?.ssn} onChange={e => set("ssn", e.target.value)} placeholder="SSN required for payroll purposes" error={errors.ssn} />
								</Field>
							</Grid>
							<Divider />
							<Field label="Work Authorization Status" required error={errors.workAuthStatus}>
								<RadioGroup required value={form?.workAuthStatus} onChange={v => set("workAuthStatus", v)}
									options={[
										{ value: "citizen", label: "U.S. Citizen" },
										{ value: "pr", label: "Permanent Resident (Green Card)" },
										{ value: "visa", label: "Visa Holder" }
									]}
								/>
							</Field>
							{(form?.workAuthStatus === "visa") && (
								<>
									<Divider />
									<Grid cols={2}>
										<Field label="Visa Type" required error={errors.visaType}>
											<FocusSelect value={form?.visaType} onChange={e => set("visaType", e.target.value)} error={errors.visaType}>
												<option value="">Select visa type</option>
												{["H-1B", "H-4 EAD", "L-1", "OPT", "CPT", "TN", "O-1", "E-3", "Other"].map(v => <option key={v}>{v}</option>)}
											</FocusSelect>
										</Field>
										<Field label="Visa Expiry Date" required error={errors.visaExpiry}>
											<FocusInput type="date" value={form?.visaExpiry} onChange={e => set("visaExpiry", e.target.value)} error={errors.visaExpiry} />
										</Field>
									</Grid>
								</>
							)}
							{
								(form?.workAuthStatus === "pr" || form?.workAuthStatus === "visa") && (
									<>
										<Divider />
										<SecHead>Passport Details</SecHead>
										<Grid cols={3}>
											<Field label="Passport Number" required error={errors.passportNumber}>
												<FocusInput value={form?.passportNumber} onChange={e => set("passportNumber", e.target.value)} placeholder="e.g. A12345678" error={errors.passportNumber} />
											</Field>
											<Field label="Country of Issue" required error={errors.countryOfIssue}>
												<FocusInput value={form?.countryOfIssue} onChange={e => set("countryOfIssue", e.target.value)} placeholder="e.g. United States" error={errors.countryOfIssue} />
											</Field>
											<Field label="Passport Expiry Date" required error={errors.passportExpiry}>
												<FocusInput type="date" value={form?.passportExpiry} onChange={e => set("passportExpiry", e.target.value)} error={errors.passportExpiry} />
											</Field>
											<Field label="I-94 Number (if applicable)">
												<FocusInput value={form?.i94} onChange={e => set("i94", e.target.value)} placeholder="11-digit number" />
											</Field>
										</Grid>
									</>
								)
							}
							<Divider />
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
								{[
									{ label: "Passport Copy", field: "docPassport", req: form?.workAuthStatus !== "citizen", hint: "Color scan preferred", span: true },
									{ label: "SSN Card", field: "docSSN", req: true, hint: "Front side", span: true },
									{ label: "Visa / Work Permit", field: "docVisa", req: form?.workAuthStatus !== "citizen", hint: "If applicable", span: true },
								].map(({ label, field, req, hint, span }) => (
									<div key={field} style={span ? { gridColumn: "1 / -1" } : {}}>
										<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
											<span style={s.label}>
												{label}
											</span>
											{req && <span style={{ fontSize: 10, fontWeight: 700, color: T.error, textTransform: "uppercase", letterSpacing: "0.5px" }}>Required</span>}
										</div>
										<FileUpload label={`Upload ${label}`} file={form[field]}
											onChange={v => { set(field, v); setErrors(e => ({ ...e, [field]: undefined })); }}
											accept=".pdf,.jpg,.jpeg,.png" hint={hint} />
										<Err msg={errors[field]} />
									</div>
								))
								}
							</div>
						</div>
					)}

					{/* ── Step 3 ── */}
					{step === 3 && (
						<div className="step-anim">
							<Grid cols={2}>
								<Field label="Highest Qualification" required error={errors.highestQualification}>
									<FocusSelect value={form?.highestQualification} onChange={e => set("highestQualification", e.target.value)} error={errors.highestQualification}>
										<option value="">Select qualification</option>
										{["High School / GED", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "MBA", "Doctorate / PhD", "Professional Certification", "Other"].map(q => <option key={q}>{q}</option>)}
									</FocusSelect>
								</Field>
								<Field label="Degree / Course Name" required error={errors.degreeName}>
									<FocusInput value={form?.degreeName} onChange={e => set("degreeName", e.target.value)} placeholder="e.g. Bachelor of Science" error={errors.degreeName} />
								</Field>
								<Field label="Specialization / Major" required error={errors.specialization}>
									<FocusInput value={form?.specialization} onChange={e => set("specialization", e.target.value)} placeholder="e.g. Computer Science" error={errors.specialization} />
								</Field>
								<Field label="University / College Name" required error={errors.universityName}>
									<FocusInput value={form?.universityName} onChange={e => set("universityName", e.target.value)} placeholder="e.g. University of Texas" error={errors.universityName} />
								</Field>
								<Field label="Graduation Year" required error={errors.graduationYear}>
									<FocusSelect value={form?.graduationYear} onChange={e => set("graduationYear", e.target.value)} error={errors.graduationYear}>
										<option value="">Select year</option>
										{Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y}>{y}</option>)}
									</FocusSelect>
								</Field>
								<Field label="GPA / CGPA / Percentage" required error={errors.gpa}>
									<FocusInput value={form?.gpa} onChange={e => set("gpa", e.target.value)} placeholder="e.g. 3.8 / 4.0 or 85%" error={errors.gpa} />
								</Field>
							</Grid>
							<Divider />
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
								{
									[
										{ label: "Latest Degree Certificate", field: "docDegree", req: true, hint: "Official copy" }
									].map(({ label, field, req, hint, span }) => (
										<div key={field} style={{ gridColumn: "1 / -1" }}>
											<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
												<span style={s.label}>
													{label}
												</span>
												{req && <span style={{ fontSize: 10, fontWeight: 700, color: T.error, textTransform: "uppercase", letterSpacing: "0.5px" }}>Required</span>}
											</div>
											<FileUpload label={`Upload ${label}`} file={form[field]}
												onChange={v => { set(field, v); setErrors(e => ({ ...e, [field]: undefined })); }}
												accept=".pdf,.jpg,.jpeg,.png" hint={hint} />
											<Err msg={errors[field]} />
										</div>
									))
								}
							</div>
						</div>
					)}

					{/* ── Step 4 ── */}
					{step === 4 && (
						<div className="step-anim">
							<SecHead>Direct Deposit / Bank Details</SecHead>
							<div style={{ ...s.infoBanner, marginBottom: 20 }}>
								🔒 Your banking information is encrypted and stored securely. It will only be used for payroll processing.
							</div>
							<Grid cols={2}>
								<Field label="Account Holder Name" required error={errors.accountHolderName}>
									<FocusInput value={form?.accountHolderName} onChange={e => set("accountHolderName", e.target.value)} placeholder="Full name as it appears on your bank account" error={errors.accountHolderName} />
								</Field>
								<Field label="Bank Name" required error={errors.bankName}>
									<FocusInput value={form?.bankName} onChange={e => set("bankName", e.target.value)} placeholder="e.g. Chase, Wells Fargo" error={errors.bankName} />
								</Field>
								<Field label="Routing Number" required error={errors.routingNumber}>
									<FocusInput value={form?.routingNumber} onChange={e => set("routingNumber", e.target.value)} placeholder="9-digit routing number" error={errors.routingNumber} />
								</Field>
								<Field label="Confirm Routing Number" required error={errors.confirmRoutingNumber}>
									<FocusInput value={form?.confirmRoutingNumber} onChange={e => set("confirmRoutingNumber", e.target.value)} placeholder="Confirm 9-digit routing number" error={errors.confirmRoutingNumber} />
								</Field>
								<Field label="Account Number" required error={errors.accountNumber}>
									<FocusInput value={form?.accountNumber} onChange={e => set("accountNumber", e.target.value)} placeholder="Account number" error={errors.accountNumber} />
								</Field>
								<Field label="Confirm Account Number" required error={errors.confirmAccountNumber}>
									<FocusInput value={form?.confirmAccountNumber} onChange={e => set("confirmAccountNumber", e.target.value)} placeholder="Confirm account number" error={errors.confirmAccountNumber} />
								</Field>
								<Field label="Account Type" required error={errors.accountType}>
									<FocusSelect value={form?.accountType} onChange={e => set("accountType", e.target.value)} error={errors.accountType}>
										<option value="">Select</option>
										<option value="savings">Savings Account</option>
										<option value="checking">Checking Account</option>
									</FocusSelect>
								</Field>
							</Grid>
							<Divider />
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
								{[
									{ label: "Cancelled / Void Check", field: "docVoidCheck", req: true, hint: "Color scan preferred" }
								].map(({ label, field, req, hint, span }) => (
									<div key={field} style={{ gridColumn: "1 / -1" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
											<span style={s.label}>
												{label}
											</span>
											{req && <span style={{ fontSize: 10, fontWeight: 700, color: T.error, textTransform: "uppercase", letterSpacing: "0.5px" }}>Required</span>}
										</div>
										<FileUpload label={`Upload ${label}`} file={form[field]}
											onChange={v => { set(field, v); setErrors(e => ({ ...e, [field]: undefined })); }}
											accept=".pdf,.jpg,.jpeg,.png" hint={hint} />
										<Err msg={errors[field]} />
									</div>
								))}
							</div>
						</div>
					)}

					{/* ── Step 5 ── */}
					{step === 5 && (
						<div className="step-anim">
							<p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
								Please upload clear, legible copies of all required documents. Accepted formats: PDF, JPG, PNG. Maximum file size: 10MB per file.
							</p>
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
								{[
									{ label: "I-94 Document", field: "docI94", req: true, hint: "Color scan preferred", span: true },
									{ label: "W4 Document", field: "docw4", req: true, hint: "Color scan preferred", span: true },
									{ label: "Offer Letter Acknowledgement", field: "docOfferLetter", req: true, hint: "Signed copy", span: true },
								].map(({ label, field, req, hint, span }) => (
									<div key={field} style={span ? { gridColumn: "1 / -1" } : {}}>
										<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
											<span style={s.label}>{label}</span>
											{req && <span style={{ fontSize: 10, fontWeight: 700, color: T.error, textTransform: "uppercase", letterSpacing: "0.5px" }}>Required</span>}
										</div>
										<FileUpload label={`Upload ${label}`} file={form[field]}
											onChange={v => { set(field, v); setErrors(e => ({ ...e, [field]: undefined })); }}
											accept=".pdf,.jpg,.jpeg,.png" hint={hint} />
										<Err msg={errors[field]} />
									</div>
								))}
							</div>
						</div>
					)}

					{/* ── Step 6 ── */}
					{step === 6 && (
						<div className="step-anim">
							<p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
								Please review all the information you have provided before submitting. You may go back to any previous step to make corrections.
							</p>
							<ReviewSection title="Personal Information">
								<ReviewRow label="First Name" value={form?.firstName} />
								<ReviewRow label="Last Name" value={form?.lastName} />
								<ReviewRow label="Preferred Name" value={form?.preferredName} />
								<ReviewRow label="Date of Birth" value={form?.dob} />
								<ReviewRow label="Gender" value={form?.gender} />
								<ReviewRow label="Nationality" value={form?.nationality} />
								<ReviewRow label="Marital Status" value={form?.maritalStatus} />
								<ReviewRow label="Personal Email" value={form?.personalEmail} />
								<ReviewRow label="Alternative Email" value={form?.alternativeEmail} />
								<ReviewRow label="Mobile Number" value={form?.mobileNumber} />
								<ReviewRow label="Alternative Mobile Number" value={form?.alternativeNumber} />
							</ReviewSection>
							<ReviewSection title="Emergency Contact">
								<ReviewRow label="Contact Name" value={form?.emergencyContactName} />
								<ReviewRow label="Contact Number" value={form?.emergencyNumber} />
								<ReviewRow label="Relationship to Employee" value={form?.relationToEmployee} />
							</ReviewSection>
							<ReviewSection title="Addresses">
								<ReviewRow label="Current Address" value={form?.residential_address} />
								<ReviewRow label="City" value={form?.residential_city} />
								<ReviewRow label="State" value={form?.residential_state} />
								<ReviewRow label="ZIP Code" value={form?.residential_zip_code} />
								{
									isSame && (
										<>
											<ReviewRow label="Permanent Address" value={form?.permanent_address} />
											<ReviewRow label="City" value={form?.permanent_city} />
											<ReviewRow label="State" value={form?.permanent_state} />
											<ReviewRow label="ZIP Code" value={form?.permanent_zip_code} />
										</>
									)
								}
							</ReviewSection>
							<ReviewSection title="Work Authorization">
								<ReviewRow label="SSN" value={form?.ssn} />
								<ReviewRow label="Authorization Status" value={form?.workAuthStatus} />
								<ReviewRow label="Visa Type" value={form?.visaType} />
								<ReviewRow label="Visa Expiry" value={form?.visaExpiry} />
								<ReviewRow label="Passport Number" value={form?.passportNumber} />
								<ReviewRow label="Country of Issue" value={form?.countryOfIssue} />
								<ReviewRow label="Passport Expiry" value={form?.passportExpiry} />
								<ReviewRow label="I-94 Number" value={form?.i94} />
							</ReviewSection>
							<ReviewSection title="Education">
								<ReviewRow label="Highest Qualification" value={form?.highestQualification} />
								<ReviewRow label="Degree" value={form?.degreeName} />
								<ReviewRow label="Specialization" value={form?.specialization} />
								<ReviewRow label="University" value={form?.universityName} />
								<ReviewRow label="Graduation Year" value={form?.graduationYear} />
								<ReviewRow label="GPA/Percentage" value={form?.gpa} />
							</ReviewSection>
							<ReviewSection title="Payroll & Tax">
								<ReviewRow label="Account Holder's Name" value={form?.accountHolderName} />
								<ReviewRow label="Bank Name" value={form?.bankName} />
								<ReviewRow label="Routing Number" value={form?.routingNumber} />
								<ReviewRow label="Account Number" value={form?.accountNumber} />
								<ReviewRow label="Account Type" value={form?.accountType} />
							</ReviewSection>
							<ReviewSection title="Documents Uploaded">
								{[
									["Passport", form?.docPassport],
									["SSN Card", form?.docSSN],
									["Visa/Work Permit", form?.docVisa],
									["Degree Certificate", form?.docDegree],
									["Cancelled/Void Check", form?.docVoidCheck],
									["I-94 Document", form?.docI94],
									["W4 Document", form?.docw4],
									["Offer Letter", form?.docOfferLetter],
								].map(([label, file]) => file && (
									<ReviewRow key={label} label={label} value={file?.name} />
								))}
							</ReviewSection>
							<div style={s.infoBanner}>
								By submitting this form, you confirm that all information provided is accurate and complete to the best of your knowledge. Any false or misleading statements may result in disqualification or termination of employment.
							</div>
						</div>
					)}

					{/* Navigation */}
					<div style={s.navRow}>
						{step > 1 && (
							<button style={s.btnSecondary} onClick={goBack} type="button" className="btn-secondary">← Back</button>
						)}
						<div style={{ flex: 1 }} />
						{step < 6 ? (
							<button style={s.btnPrimary} onClick={goNext} type="button" className="btn-primary">Save & Continue →</button>
						) : (
							<button style={s.btnPrimary} onClick={handleSubmit} type="button" className="btn-primary">Submit Onboarding Form</button>
						)}
					</div>
				</div>

				<p style={{ textAlign: "center", fontSize: 12, color: T.textLight, marginTop: 20 }}>
					Step {step} of {STEPS?.length} · Your progress is saved automatically
				</p>
			</div >
		</>
	);
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
	page: { minHeight: "100vh", background: T.bg, padding: "40px 16px 80px", fontFamily: T.fontSans, color: T.text },
	progressWrap: { width: "100%", maxWidth: 880, margin: "0 auto", height: 3, background: T.border, borderRadius: 2 },
	progressBar: { height: "100%", background: T.primary, borderRadius: 2, transition: "width 0.4s ease" },
	stepNav: { display: "flex", justifyContent: "space-between", maxWidth: 880, margin: "0 auto 28px", padding: "16px 0", overflowX: "auto", gap: 4 },
	stepNavItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, minWidth: 80 },
	stepDot: { width: 32, height: 32, borderRadius: "50%", border: `2px solid ${T.border}`, background: "#fff", color: T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, transition: "all 0.25s" },
	stepDotActive: { border: `2px solid ${T.primary}`, background: T.primary, color: "#fff" },
	stepDotDone: { border: `2px solid ${T.primary}`, background: T.primary, color: "#fff" },
	stepNavLabel: { fontSize: 14, color: T.textMuted, fontWeight: 500, textAlign: "center", lineHeight: 1.3, whiteSpace: "nowrap" },
	card: { background: T.bgCard, borderRadius: 12, border: `1px solid ${T.border}`, padding: "40px 48px", maxWidth: 880, margin: "0 auto", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
	cardHeader: { marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${T.border}` },
	cardStep: { fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 },
	cardTitle: { fontSize: 24, fontWeight: 700, color: T.text, margin: 0, fontFamily: T.font, letterSpacing: "-0.3px" },
	sectionHeading: { fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" },
	label: { fontSize: 13, fontWeight: 600, color: "#374151", letterSpacing: "0.1px" },
	input: { width: "100%", padding: "10px 13px", fontSize: 14, border: `1px solid ${T.border}`, borderRadius: 7, fontFamily: T.fontSans, color: T.text, background: "#fff", outline: "none", transition: "border-color 0.18s, box-shadow 0.18s", boxSizing: "border-box" },
	errMsg: { fontSize: 12, color: T.error, fontWeight: 500 },
	radioGroup: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 4 },
	radioItem: { display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", border: `1px solid ${T.border}`, borderRadius: 7, cursor: "pointer", background: "#fff", transition: "all 0.18s", userSelect: "none" },
	radioItemActive: { border: `1.5px solid ${T.primary}`, background: "#f0f5f4" },
	radioLabel: { fontSize: 14, color: T.text, fontWeight: 500 },
	radioDot: { width: 16, height: 16, borderRadius: "50%", border: `2px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.18s" },
	radioDotActive: { border: `2px solid ${T.primary}`, background: T.primary, boxShadow: "inset 0 0 0 3px #fff" },
	fileZone: { border: `1.5px dashed ${T.border}`, borderRadius: 8, padding: "18px 20px", cursor: "pointer", background: T.bgSection, transition: "all 0.18s", minHeight: 82, display: "flex", alignItems: "center" },
	fileEmpty: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 4, opacity: 0.75 },
	fileList: { display: "flex", alignItems: "center", gap: 12 },
	fileName: { margin: 0, fontSize: 13, fontWeight: 600, color: T.text },
	fileChange: { margin: 0, fontSize: 12, color: T.primary },
	infoBanner: { background: "#f0f5f4", border: `1px solid #c6d9d5`, borderRadius: 7, padding: "12px 16px", fontSize: 13, color: T.primary, lineHeight: 1.6, fontWeight: 500 },
	navRow: { display: "flex", alignItems: "center", marginTop: 36, paddingTop: 24, borderTop: `1px solid ${T.border}`, gap: 12 },
	btnPrimary: { padding: "11px 28px", background: T.primary, color: "#fff", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: T.fontSans, letterSpacing: "0.2px", transition: "background 0.18s, transform 0.12s" },
	btnSecondary: { padding: "11px 22px", background: "#fff", color: T.text, border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.fontSans, transition: "all 0.18s" },
	reviewSection: { marginBottom: 24, borderBottom: `1px solid ${T.border}`, paddingBottom: 20 },
	reviewTitle: { fontSize: 11, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 12px" },
	reviewRow: { display: "flex", gap: 16, padding: "5px 0", fontSize: 13, borderBottom: `1px dashed ${T.border}` },
	reviewLabel: { width: 200, flexShrink: 0, color: T.textMuted, fontWeight: 500 },
	reviewValue: { color: T.text, fontWeight: 500, wordBreak: "break-word" },
	successBadge: { width: 64, height: 64, borderRadius: "50%", background: T.primary, color: "#fff", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" },
	successMeta: { display: "flex", justifyContent: "center", gap: 32, background: T.bgSection, padding: "16px 24px", borderRadius: 8, fontSize: 13, color: T.textMuted, border: `1px solid ${T.border}`, flexWrap: "wrap" },
	checkRow: { display: "flex", alignItems: "center", gap: 10, padding: "13px 18px", background: T.bgRow, border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 8, cursor: "pointer", width: "100%", textAlign: "left", margin: "5px 0" },
	checkBox: { width: 18, height: 18, borderRadius: 4, border: "1.5px solid", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s, border-color 0.15s" },
	checkLabel: { fontSize: 14, color: T.primary },
};

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