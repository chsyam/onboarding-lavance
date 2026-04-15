import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing env variable: RESEND_API_KEY");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;