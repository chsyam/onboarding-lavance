import crypto from "crypto";

export function generateOnboardingToken(days = 7) {
    const token = crypto.randomBytes(32).toString("hex"); // 64-char hex
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    return { token, expiresAt };
}
