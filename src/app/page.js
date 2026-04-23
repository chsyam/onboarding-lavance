"use client";

import { useState, useRef, useEffect } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { RotatingLines } from "react-loader-spinner";

// ─── Design tokens from Lavance LLC ───────────────────────────────────────────
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
	firstName: "", lastName: "", preferredName: "", dob: "", gender: "",
	nationality: "", maritalStatus: "", personalEmail: "", mobile: "", alternativeNumber: "",
	currentAddress: "", permanentAddress: "",
	ssn: "", workAuthStatus: "", visaType: "", visaExpiry: "",
	passportNumber: "", passportExpiry: "", countryOfIssue: "",
	i94: "", eadNumber: "", govIdFiles: [],
	highestQualification: "", degreeName: "", specialization: "",
	universityName: "", graduationYear: "", gpa: "",
	prevEducation: "", transcriptFiles: [],
	employeeId: "", joiningDate: "", jobTitle: "", department: "",
	reportingManager: "", workLocation: "", employmentType: "",
	salary: "", taxFilingStatus: "",
	bankName: "", routingNumber: "", accountNumber: "",
	docPassport: [], docSSN: [], docVisa: [], docResume: [],
	docDegree: [], docExperience: [], docPayslips: [],
	docOfferLetter: [], docNDA: [],
};

const modalStyles = {
	overlay: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
		backdropFilter: "blur(4px)",
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	card: {
		background: "#fff",
		borderRadius: "16px",
		padding: "40px 36px 32px",
		width: 360,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "16px",
		outline: "none",
		boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
	},
	iconWrap: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		margin: "20px auto",
		textAlign: "center",
		color: "#000",
	},
	iconInner: {
		position: "absolute",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	textWrap: {
		textAlign: "center",
	},
	title: {
		fontSize: "18px",
		fontWeight: 600,
		color: "#111",
		margin: 0,
	},
	subtitle: {
		fontSize: "14px",
		color: "#666",
		margin: "6px 0 0",
		minHeight: 20,
		animation: "fadeIn 0.3s ease",
		"@keyframes fadeIn": {
			from: { opacity: 0, transform: "translateY(4px)" },
			to: { opacity: 1, transform: "translateY(0)" },
		},
	},
	barTrack: {
		width: "100%",
		height: 6,
		background: "#f0f0f0",
		borderRadius: 99,
		overflow: "hidden",
		marginTop: 4,
	},
	barFill: {
		height: "100%",
		background: "linear-gradient(90deg, #1D9E75, #34d399)",
		borderRadius: 99,
		transition: "width 0.04s linear",
	},
	progressLabel: {
		fontSize: 12,
		color: "#999",
		alignSelf: "flex-end",
		marginTop: -8,
	},
	dots: {
		display: "flex",
		gap: "8px",
		marginTop: 4,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: "50%",
		transition: "all 0.3s ease",
	},
};

function TokenValidation({ open }) {

	return (
		<div>
			<Modal open={open}>
				<Box sx={modalStyles.overlay}>
					<Box sx={modalStyles.card}>

						{/* Icon circle */}
						<Box sx={modalStyles.iconWrap}>
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
					</Box>
				</Box>
			</Modal>
		</div>
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

function SameAddressCheckbox({ checked, onChange }) {
	return (
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

function FileUpload({ label, files, onChange, accept, multiple = false, hint }) {
	const ref = useRef();
	return (
		<div style={s.fileZone} onClick={() => ref.current.click()} className="file-zone">
			<input ref={ref} type="file" accept={accept} multiple={multiple} style={{ display: "none" }}
				onChange={e => onChange(multiple ? Array.from(e.target.files) : Array.from(e.target.files).slice(0, 1))} />
			{files?.length > 0 ? (
				<div style={s.fileList}>
					<span style={{ fontSize: 22 }}>📎</span>
					<div>
						{files.map((f, i) => <p key={i} style={s.fileName}>{f.name}</p>)}
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

// function LoadingScreen() {
// 	return (
// 		<div>
// 			<Backdrop
// 				sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
// 				open={open}
// 				onClick={handleClose}
// 			>
// 				<CircularProgress color="inherit" />
// 			</Backdrop>
// 		</div>
// 	);
// }

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(step, form) {
	const e = {};
	const req = (f, msg) => { if (!form[f]?.toString().trim()) e[f] = msg || "This field is required"; };
	if (step === 1) {
		req("fullLegalName"); req("dob"); req("nationality"); req("mobile"); req("currentAddress");
		if (!form.personalEmail || !/\S+@\S+\.\S+/.test(form.personalEmail)) e.personalEmail = "Enter a valid email address";
	}
	if (step === 2) {
		req("ssn"); req("workAuthStatus"); req("passportNumber"); req("passportExpiry"); req("countryOfIssue");
		if (!form.govIdFiles?.length) e.govIdFiles = "Please upload at least one government ID";
		if (["visa", "opt"].includes(form.workAuthStatus)) { req("visaType"); req("visaExpiry"); }
	}
	if (step === 3) {
		req("highestQualification"); req("degreeName"); req("universityName"); req("graduationYear");
		if (!form.transcriptFiles?.length) e.transcriptFiles = "Please upload your degree/transcript";
	}
	if (step === 4) {
		req("joiningDate"); req("jobTitle"); req("department"); req("reportingManager"); req("workLocation");
		req("employmentType"); req("taxFilingStatus"); req("bankName"); req("routingNumber"); req("accountNumber");
	}
	if (step === 5) {
		if (!form.docResume?.length) e.docResume = "Resume is required";
		if (!form.docDegree?.length) e.docDegree = "Degree certificate is required";
		if (!form.docOfferLetter?.length) e.docOfferLetter = "Offer letter acknowledgement is required";
	}
	return {} //e;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OnboardingForm() {
	const [step, setStep] = useState(1);
	const [form, setForm] = useState(INIT);
	const [errors, setErrors] = useState({});
	const [submitted, setSubmitted] = useState(false);
	const [isSame, setIsSame] = useState(false);
	const [open, setOpen] = useState(true);

	const set = (field, value) => {
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
		const response = await fetch(`/api/admin/token_validation/${token}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data);
		return data;
	}

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const urlToken = params.get('token');

		if (!urlToken) return;

		validateToken(urlToken).then((data) => {
			if (data?.data) {
				const token_user = data.data;
				set("firstName", token_user?.first_name);
				set("lastName", token_user?.last_name);
				set("personalEmail", token_user?.email);
				setOpen(false);
			}
		});
	}, []);

	const handleSubmit = () => {
		const e = validate(step, form);
		console.log(form);

		setErrors(e);
		if (!Object.keys(e)?.length) {
			saveEmployeeData();
			setSubmitted(true);
		};
	};

	const sendOnboardingEmail = async () => {
		try {
			const response = await fetch("/api/emails/onboarding/send-invite", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					candidateEmail: "syamkumar6845@gmail.com",
					candidateName: "Syam Kumar",
					jobTitle: "Software Engineer",
					startDate: "2026-04-20",
					token: "abc123xyz",
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
		try {
			const response = await fetch(`/api/employees/address/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					employeeId: employeeId,
					residential_address_line1: "4512 Legacy DR STE 100 Plano",
					residential_address_line2: "",
					residential_city: "Plano",
					residential_state: "Texas",
					residential_zip_code: "45070",
					residential_country: "United States",
					residential_permanent_same: true,
					permanent_address_line1: "",
					permanent_address_line2: "",
					permanent_city: "",
					permanent_state: "",
					permanent_zip_code: "",
					permanent_country: ""
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
					highestQualification: "",
					degreeName: "",
					specialization: "",
					university: "",
					graduatedYear: "",
					grade: ""
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
					bankName: "",
					routingNumber: "",
					accountNumber: ""
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Payroll & Tax info saved successfully", data.insertId);

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
					ssn: "",
					work_permit_number: "",
					work_auth_status: "",
					visaType: "",
					visa_expiry_dt: "",
					passport_number: "",
					country_of_issue: "",
					passport_expiry_date: ""
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Work Authorization info saved successfully", data.insertId);

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
			const response = await fetch(`/api/employees/documents/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					employeeId: employeeId,
					passport_url: "",
					ssn_url: "",
					work_permit_url: "",
					resume_url: "",
					latest_degree_certificate_url: "",
					experience_letter_url: "",
					previous_payslip_1_url: "",
					previous_payslip_2_url: "",
					previous_payslip_3_url: "",
					offer_acknowledgement_url: "",
					signed_nda_url: "",
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Documents info saved successfully", data.insertId);

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
					userId: 1,
					firstName: form.firstName,
					lastName: form.lastName,
					preferredName: form.preferredName,
					dob: form.dob,
					gender: form.gender,
					nationality: form.nationality,
					maritalStatus: form.maritalStatus,
					personalEmail: form.personalEmail,
					mobile: form.mobile
				}),
			});

			const data = await response.json();

			if (response.ok && data.insertId) {
				console.log("Personal info saved successfully", data.insertId);

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
					await sendOnboardingEmail();
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
							Thank you <strong>{form.preferredName || form.fullLegalName || "Buddy"}</strong>. Your onboarding information has been submitted. Our HR team will review your documents and be in touch at <strong>{form.personalEmail}</strong> within 1-2 business days.
						</p>
						{/* <div style={s.successMeta}>
							<span>Start Date: <strong>{form.joiningDate || "—"}</strong></span>
							<span>Role: <strong>{form.jobTitle || "—"}</strong></span>
							<span>Department: <strong>{form.department || "—"}</strong></span>
						</div> */}
					</div>
				</div>
			</>
		);
	}
	const progress = ((step - 1) / (STEPS?.length - 1)) * 100;

	return (
		<>
			<TokenValidation open={open} />
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
								<Field label="First Name" required error={errors.fullLegalName}>
									<FocusInput value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Exactly as per passport / government ID" error={errors.fullLegalName} />
								</Field>
								<Field label="Last Name" required error={errors.fullLegalName}>
									<FocusInput value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Exactly as per passport / government ID" error={errors.fullLegalName} />
								</Field>
								<Field label="Preferred / Display Name">
									<FocusInput value={form.preferredName} onChange={e => set("preferredName", e.target.value)} placeholder="What you'd like to be called" />
								</Field>
								<Field label="Date of Birth" required error={errors.dob}>
									<FocusInput type="date" value={form.dob} onChange={e => set("dob", e.target.value)} error={errors.dob} />
								</Field>
								<Field label="Gender" required>
									<FocusSelect value={form.gender} onChange={e => set("gender", e.target.value)}>
										<option value="">Prefer not to say</option>
										<option>Male</option>
										<option>Female</option>
										<option>Other</option>
									</FocusSelect>
								</Field>
								<Field label="Nationality / Citizenship" required error={errors.nationality}>
									<FocusInput value={form.nationality} onChange={e => set("nationality", e.target.value)} placeholder="e.g. United States" error={errors.nationality} />
								</Field>
								<Field label="Marital Status" required>
									<FocusSelect value={form.maritalStatus} onChange={e => set("maritalStatus", e.target.value)}>
										<option value="">Select</option>
										<option>Single</option>
										<option>Married</option>
										<option>Divorced</option>
									</FocusSelect>
								</Field>
								<Field label="Personal Email Address" required error={errors.personalEmail}>
									<FocusInput type="email" value={form.personalEmail} onChange={e => set("personalEmail", e.target.value)} placeholder="your@email.com" error={errors.personalEmail} />
								</Field>
								<Field label="Alternative Email Address" required error={errors.personalEmail}>
									<FocusInput type="email" value={form.alternativeEmail} onChange={e => set("alternativeEmail", e.target.value)} placeholder="your@email.com" error={errors.personalEmail} />
								</Field>
								<Field label="Mobile Number" required error={errors.mobile}>
									<FocusInput value={form.mobile} onChange={e => set("mobile", e.target.value)} placeholder="+1 (555) 000-0000" error={errors.mobile} />
								</Field>
								<Field label="Alternative Contact Number" required error={errors.alternativeNumber}>
									<FocusInput value={form.alternativeNumber} onChange={e => set("alternativeNumber", e.target.value)} placeholder="+1 (555) 000-0000" error={errors.alternativeNumber} />
								</Field>
							</Grid>
							<Divider />
							<Grid cols={2}>
								<Field label="Emergency Contact Name" required error={errors.emergencyContactName}>
									<FocusInput value={form.emergencyContactName} onChange={e => set("emergencyContactName", e.target.value)} placeholder="Emergency Contact Name" error={errors.emergencyContactName} />
								</Field>
								<Field label="Emergency Contact Number" required error={errors.emergencyNumber}>
									<FocusInput value={form.emergencyNumber} onChange={e => set("emergencyNumber", e.target.value)} placeholder="+1 (555) 000-0000" error={errors.emergencyNumber} />
								</Field>
								<Field label="Relationship to employee" required error={errors.relationToEmployee}>
									<FocusInput value={form.relationToEmployee} onChange={e => set("relationToEmployee", e.target.value)} placeholder="Relationship to employee" error={errors.relationToEmployee} />
								</Field>
							</Grid>
							<Divider />
							<Grid cols={1}>
								<Field label="Current Residential Address" required error={errors.currentAddress} span>
									<FocusTextarea value={form.currentAddress} onChange={e => set("currentAddress", e.target.value)} placeholder="Address Line 1" error={errors.currentAddress} />
								</Field>
							</Grid>
							<Grid cols={2}>
								<Field label="City" required error={errors.fullLegalName}>
									<FocusInput value={form.fullLegalName} onChange={e => set("fullLegalName", e.target.value)} placeholder="City" error={errors.fullLegalName} />
								</Field>
								<Field label="State" required error={errors.fullLegalName}>
									<FocusInput value={form.fullLegalName} onChange={e => set("fullLegalName", e.target.value)} placeholder="State" error={errors.fullLegalName} />
								</Field>
								<Field label="ZIP" required error={errors.fullLegalName}>
									<FocusInput value={form.fullLegalName} onChange={e => set("fullLegalName", e.target.value)} placeholder="ZIP Code" error={errors.fullLegalName} />
								</Field>
							</Grid>
							<SameAddressCheckbox checked={isSame} onChange={() => setIsSame(!isSame)} />
							<Grid cols={1}>
								<Field label="Permanent Residential Address" required error={errors.permanentAddress} span>
									<FocusTextarea value={isSame ? form.currentAddress : form.permanentAddress} onChange={e => set("permanentAddress", e.target.value)} placeholder="Address Line 1" error={errors.permanentAddress} />
								</Field>
							</Grid>
							<Grid cols={2}>
								<Field label="City" required error={errors.fullLegalName}>
									<FocusInput value={form.fullLegalName} onChange={e => set("fullLegalName", e.target.value)} placeholder="City" error={errors.fullLegalName} />
								</Field>
								<Field label="State" required error={errors.fullLegalName}>
									<FocusInput value={form.fullLegalName} onChange={e => set("fullLegalName", e.target.value)} placeholder="State" error={errors.fullLegalName} />
								</Field>
								<Field label="ZIP" required error={errors.fullLegalName}>
									<FocusInput value={form.fullLegalName} onChange={e => set("fullLegalName", e.target.value)} placeholder="ZIP Code" error={errors.fullLegalName} />
								</Field>
							</Grid>
							{/* <Grid cols={1}>
								<Field label="Current Residential Address" required error={errors.currentAddress} span>
									<FocusTextarea value={form.currentAddress} onChange={e => set("currentAddress", e.target.value)} placeholder="Street, City, State, ZIP, Country" error={errors.currentAddress} />
								</Field>
								<Field label="Permanent Address (if different from above)" span>
									<FocusTextarea value={form.permanentAddress} onChange={e => set("permanentAddress", e.target.value)} placeholder="Leave blank if same as above" />
								</Field>
							</Grid> */}
						</div>
					)}

					{/* ── Step 2 ── */}
					{step === 2 && (
						<div className="step-anim">
							<Grid cols={2}>
								<Field label="Social Security Number (SSN) / ITIN" required error={errors.ssn}>
									<FocusInput value={form.ssn} onChange={e => set("ssn", e.target.value)} placeholder="XXX-XX-XXXX" error={errors.ssn} />
								</Field>
							</Grid>
							<Divider />
							<SecHead>Work Authorization Status</SecHead>
							<RadioGroup required value={form.workAuthStatus} onChange={v => set("workAuthStatus", v)} error={errors.workAuthStatus}
								options={[
									{ value: "citizen", label: "U.S. Citizen" },
									{ value: "pr", label: "Permanent Resident (Green Card)" },
									{ value: "visa", label: "Visa Holder" },
									// { value: "opt", label: "OPT / CPT / H-1B / L-1 / Other" },
								]}
							/>
							{(form.workAuthStatus === "visa") && (
								<>
									<Divider />
									<Grid cols={2}>
										<Field label="Visa Type" required error={errors.visaType}>
											<FocusSelect value={form.visaType} onChange={e => set("visaType", e.target.value)} error={errors.visaType}>
												<option value="">Select visa type</option>
												{["H-1B", "H-4 EAD", "L-1", "OPT", "CPT", "TN", "O-1", "E-3", "Other"].map(v => <option key={v}>{v}</option>)}
											</FocusSelect>
										</Field>
										<Field label="Visa Expiry Date" required error={errors.visaExpiry}>
											<FocusInput type="date" value={form.visaExpiry} onChange={e => set("visaExpiry", e.target.value)} error={errors.visaExpiry} />
										</Field>
									</Grid>
								</>
							)}
							{
								(form.workAuthStatus === "pr" || form?.workAuthStatus === "visa") && (
									<>
										<Divider />
										<SecHead>Passport Details</SecHead>
										<Grid cols={3}>
											<Field label="Passport Number" required error={errors.passportNumber}>
												<FocusInput value={form.passportNumber} onChange={e => set("passportNumber", e.target.value)} placeholder="e.g. A12345678" error={errors.passportNumber} />
											</Field>
											<Field label="Country of Issue" required error={errors.countryOfIssue}>
												<FocusInput value={form.countryOfIssue} onChange={e => set("countryOfIssue", e.target.value)} placeholder="e.g. United States" error={errors.countryOfIssue} />
											</Field>
											<Field label="Passport Expiry Date" required error={errors.passportExpiry}>
												<FocusInput type="date" value={form.passportExpiry} onChange={e => set("passportExpiry", e.target.value)} error={errors.passportExpiry} />
											</Field>
											<Field label="I-94 Number (if applicable)">
												<FocusInput value={form.i94} onChange={e => set("i94", e.target.value)} placeholder="11-digit number" />
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
										<FileUpload label={`Upload ${label}`} files={form[field]}
											onChange={v => { set(field, v); setErrors(e => ({ ...e, [field]: undefined })); }}
											accept=".pdf,.jpg,.jpeg,.png" multiple hint={hint} />
										<Err msg={errors[field]} />
									</div>
								))
								}
							</div>
							{/* <Divider />
							<SecHead>Government ID Documents</SecHead>
							<FileUpload label="Upload Government ID(s)" files={form.govIdFiles}
								onChange={v => { set("govIdFiles", v); setErrors(e => ({ ...e, govIdFiles: undefined })); }}
								accept=".pdf,.jpg,.jpeg,.png" multiple hint="Passport, Driver's License, State ID — PDF or image, max 10MB each" />
							<Err msg={errors.govIdFiles} /> */}
						</div>
					)}

					{/* ── Step 3 ── */}
					{step === 3 && (
						<div className="step-anim">
							<Grid cols={2}>
								<Field label="Highest Qualification" required error={errors.highestQualification}>
									<FocusSelect value={form.highestQualification} onChange={e => set("highestQualification", e.target.value)} error={errors.highestQualification}>
										<option value="">Select qualification</option>
										{["High School / GED", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "MBA", "Doctorate / PhD", "Professional Certification", "Other"].map(q => <option key={q}>{q}</option>)}
									</FocusSelect>
								</Field>
								<Field label="Degree / Course Name" required error={errors.degreeName}>
									<FocusInput value={form.degreeName} onChange={e => set("degreeName", e.target.value)} placeholder="e.g. Bachelor of Science" error={errors.degreeName} />
								</Field>
								<Field label="Specialization / Major">
									<FocusInput value={form.specialization} onChange={e => set("specialization", e.target.value)} placeholder="e.g. Computer Science" />
								</Field>
								<Field label="University / College Name" required error={errors.universityName}>
									<FocusInput value={form.universityName} onChange={e => set("universityName", e.target.value)} placeholder="e.g. University of Texas" error={errors.universityName} />
								</Field>
								<Field label="Graduation Year" required error={errors.graduationYear}>
									<FocusSelect value={form.graduationYear} onChange={e => set("graduationYear", e.target.value)} error={errors.graduationYear}>
										<option value="">Select year</option>
										{Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y}>{y}</option>)}
									</FocusSelect>
								</Field>
								<Field label="GPA / CGPA / Percentage">
									<FocusInput value={form.gpa} onChange={e => set("gpa", e.target.value)} placeholder="e.g. 3.8 / 4.0 or 85%" />
								</Field>
							</Grid>
							<Divider />
							{/* <Field label="Previous Education Details (Optional)" span>
								<FocusTextarea value={form.prevEducation} onChange={e => set("prevEducation", e.target.value)} placeholder="List any additional degrees, diplomas, or certifications" rows={3} />
							</Field> */}
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
								{
									[
										{ label: "Latest Degree Certificate", field: "docDegree", req: true, hint: "Official copy" }
									].map(({ label, field, req, hint, span }) => (
										<div key={field} style={{ gridColumn: "1 / -1" }}>
											<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
												<span style={s.label}>
													Cancelled / Void Check
												</span>
												{req && <span style={{ fontSize: 10, fontWeight: 700, color: T.error, textTransform: "uppercase", letterSpacing: "0.5px" }}>Required</span>}
											</div>
											<FileUpload label={`Upload ${label}`} files={form[field]}
												onChange={v => { set(field, v); setErrors(e => ({ ...e, [field]: undefined })); }}
												accept=".pdf,.jpg,.jpeg,.png" multiple hint={hint} />
											<Err msg={errors[field]} />
										</div>
									))
								}
							</div>
							{/* <Divider />
							<SecHead>Academic Documents</SecHead>
							<FileUpload label="Upload Degree Certificate / Official Transcript" files={form.transcriptFiles}
								onChange={v => { set("transcriptFiles", v); setErrors(e => ({ ...e, transcriptFiles: undefined })); }}
								accept=".pdf,.jpg,.jpeg,.png" multiple hint="PDF or image — max 10MB each" />
							<Err msg={errors.transcriptFiles} /> */}
						</div>
					)}

					{/* ── Step 4 ── */}
					{step === 4 && (
						<div className="step-anim">
							{/* <SecHead>Position Details</SecHead>
							<Grid cols={2}>
								<Field label="Employee ID">
									<FocusInput value={form.employeeId} onChange={e => set("employeeId", e.target.value)} placeholder="Auto-assigned if blank" />
								</Field>
								<Field label="Joining Date" required error={errors.joiningDate}>
									<FocusInput type="date" value={form.joiningDate} onChange={e => set("joiningDate", e.target.value)} error={errors.joiningDate} />
								</Field>
								<Field label="Job Title / Designation" required error={errors.jobTitle}>
									<FocusInput value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} placeholder="e.g. Senior Software Engineer" error={errors.jobTitle} />
								</Field>
								<Field label="Department" required error={errors.department}>
									<FocusSelect value={form.department} onChange={e => set("department", e.target.value)} error={errors.department}>
										<option value="">Select department</option>
										{["Engineering", "Product", "Design", "Marketing", "Sales", "Finance", "Operations", "HR", "Legal", "Customer Success"].map(d => <option key={d}>{d}</option>)}
									</FocusSelect>
								</Field>
								<Field label="Reporting Manager" required error={errors.reportingManager}>
									<FocusInput value={form.reportingManager} onChange={e => set("reportingManager", e.target.value)} placeholder="Manager's full name" error={errors.reportingManager} />
								</Field>
								<Field label="Work Location" required error={errors.workLocation}>
									<FocusInput value={form.workLocation} onChange={e => set("workLocation", e.target.value)} placeholder="City, State / Remote" error={errors.workLocation} />
								</Field>
							</Grid>
							<Divider />
							<SecHead>Employment Type</SecHead>
							<RadioGroup value={form.employmentType} onChange={v => set("employmentType", v)} error={errors.employmentType}
								options={[
									{ value: "fulltime", label: "Full-Time" },
									{ value: "contract", label: "Contract" },
									{ value: "intern", label: "Intern" },
									{ value: "parttime", label: "Part-Time" },
								]}
							/>
							<Divider />
							<SecHead>Compensation & Tax</SecHead>
							<Grid cols={2}>
								<Field label="Annual Salary / Compensation">
									<FocusInput value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="e.g. $95,000" />
								</Field>
								<Field label="Tax Filing Status" required error={errors.taxFilingStatus}>
									<FocusSelect value={form.taxFilingStatus} onChange={e => set("taxFilingStatus", e.target.value)} error={errors.taxFilingStatus}>
										<option value="">Select status</option>
										<option value="single">Single</option>
										<option value="mfj">Married Filing Jointly</option>
										<option value="mfs">Married Filing Separately</option>
										<option value="hoh">Head of Household</option>
										<option value="qss">Qualifying Surviving Spouse</option>
									</FocusSelect>
								</Field>
							</Grid>
							<Divider /> */}
							<SecHead>Direct Deposit / Bank Details</SecHead>
							<div style={{ ...s.infoBanner, marginBottom: 20 }}>
								🔒 Your banking information is encrypted and stored securely. It will only be used for payroll processing.
							</div>
							<Grid cols={2}>
								<Field label="Account Holder Name" required error={errors.bankName}>
									<FocusInput value={form.accountHolderName} onChange={e => set("accountHolderName", e.target.value)} placeholder="Full name as it appears on your bank account" error={errors.bankName} />
								</Field>
								<Field label="Bank Name" required error={errors.bankName}>
									<FocusInput value={form.bankName} onChange={e => set("bankName", e.target.value)} placeholder="e.g. Chase, Wells Fargo" error={errors.bankName} />
								</Field>
								<Field label="Routing Number" required error={errors.routingNumber}>
									<FocusInput value={form.routingNumber} onChange={e => set("routingNumber", e.target.value)} placeholder="9-digit routing number" error={errors.routingNumber} />
								</Field>
								<Field label="Confirm Routing Number" required error={errors.routingNumber}>
									<FocusInput value={form.confirmRoutingNumber} onChange={e => set("confirmRoutingNumber", e.target.value)} placeholder="Confirm 9-digit routing number" error={errors.routingNumber} />
								</Field>
								<Field label="Account Number" required error={errors.accountNumber}>
									<FocusInput value={form.accountNumber} onChange={e => set("accountNumber", e.target.value)} placeholder="Account number" error={errors.accountNumber} />
								</Field>
								<Field label="Confirm Account Number" required error={errors.accountNumber}>
									<FocusInput value={form.confirmAccountNumber} onChange={e => set("confirmAccountNumber", e.target.value)} placeholder="Confirm account number" error={errors.accountNumber} />
								</Field>
								<Field label="Account Type" required>
									<FocusSelect value={form.accountType} onChange={e => set("accountType", e.target.value)}>
										<option value="">Select</option>
										<option>Savings Account</option>
										<option>Current Account</option>
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
												Cancelled / Void Check
											</span>
											{req && <span style={{ fontSize: 10, fontWeight: 700, color: T.error, textTransform: "uppercase", letterSpacing: "0.5px" }}>Required</span>}
										</div>
										<FileUpload label={`Upload ${label}`} files={form[field]}
											onChange={v => { set(field, v); setErrors(e => ({ ...e, [field]: undefined })); }}
											accept=".pdf,.jpg,.jpeg,.png" multiple hint={hint} />
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
									{ label: "Resume / CV", field: "docResume", req: true, hint: "Most recent version", span: true },
									{ label: "Offer Letter Acknowledgement", field: "docOfferLetter", req: true, hint: "Signed copy", span: true },
									{ label: "I-94 Document", field: "docI94", req: true, hint: "Color scan preferred", span: true },
									{ label: "W4 Document", field: "docw4", req: true, hint: "Color scan preferred", span: true },
								].map(({ label, field, req, hint, span }) => (
									<div key={field} style={span ? { gridColumn: "1 / -1" } : {}}>
										<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
											<span style={s.label}>{label}</span>
											{req && <span style={{ fontSize: 10, fontWeight: 700, color: T.error, textTransform: "uppercase", letterSpacing: "0.5px" }}>Required</span>}
										</div>
										<FileUpload label={`Upload ${label}`} files={form[field]}
											onChange={v => { set(field, v); setErrors(e => ({ ...e, [field]: undefined })); }}
											accept=".pdf,.jpg,.jpeg,.png" multiple hint={hint} />
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
								<ReviewRow label="Full Legal Name" value={form.fullLegalName} />
								<ReviewRow label="Preferred Name" value={form.preferredName} />
								<ReviewRow label="Date of Birth" value={form.dob} />
								<ReviewRow label="Nationality" value={form.nationality} />
								<ReviewRow label="Personal Email" value={form.personalEmail} />
								<ReviewRow label="Mobile" value={form.mobile} />
								<ReviewRow label="Current Address" value={form.currentAddress} />
							</ReviewSection>
							<ReviewSection title="Work Authorization">
								<ReviewRow label="Auth Status" value={form.workAuthStatus} />
								<ReviewRow label="Passport Number" value={form.passportNumber} />
								<ReviewRow label="Country of Issue" value={form.countryOfIssue} />
								<ReviewRow label="Passport Expiry" value={form.passportExpiry} />
								{form.visaType && <ReviewRow label="Visa Type" value={form.visaType} />}
							</ReviewSection>
							<ReviewSection title="Education">
								<ReviewRow label="Qualification" value={form.highestQualification} />
								<ReviewRow label="Degree" value={form.degreeName} />
								<ReviewRow label="Specialization" value={form.specialization} />
								<ReviewRow label="University" value={form.universityName} />
								<ReviewRow label="Graduation Year" value={form.graduationYear} />
							</ReviewSection>
							<ReviewSection title="Position & Payroll">
								<ReviewRow label="Job Title" value={form.jobTitle} />
								<ReviewRow label="Department" value={form.department} />
								<ReviewRow label="Employment Type" value={form.employmentType} />
								<ReviewRow label="Joining Date" value={form.joiningDate} />
								<ReviewRow label="Reporting Manager" value={form.reportingManager} />
								<ReviewRow label="Work Location" value={form.workLocation} />
								<ReviewRow label="Tax Filing Status" value={form.taxFilingStatus} />
								<ReviewRow label="Bank" value={form.bankName} />
							</ReviewSection>
							<ReviewSection title="Documents Uploaded">
								{[
									["Resume", form.docResume],
									["Degree Certificate", form.docDegree],
									["Passport", form.docPassport],
									["SSN Card", form.docSSN],
									["Visa/Work Permit", form.docVisa], ["Experience Letters", form.docExperience],
									["Payslips", form.docPayslips],
									["Offer Letter", form.docOfferLetter],
									["NDA/Policy Docs", form.docNDA],
									["Cancelled/Void Check", form.docVoidCheck],
								].map(([label, files]) => files?.length > 0 && (
									<ReviewRow key={label} label={label} value={files.map(f => f.name).join(", ")} />
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
	successMeta: { display: "flex", justifyContent: "center", gap: 32, background: T.bgSection, padding: "16px 24px", borderRadius: 8, fontSize: 13, color: T.textMuted, border: `1px solid ${T.border}`, flexWrap: "wrap" }, checkRow: { display: "flex", alignItems: "center", gap: 10, padding: "13px 18px", background: T.bgRow, border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 8, cursor: "pointer", width: "100%", textAlign: "left", margin: "20px 0" },
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