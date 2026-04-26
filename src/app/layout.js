import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
	title: "Employee Onboarding Form | Lavance Group",
	description: "A comprehensive employee onboarding form designed to streamline the hiring process and ensure a smooth transition for new hires at Lavance Group.",
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			className={`h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">{children}</body>
			<Analytics />
		</html>
	);
}
