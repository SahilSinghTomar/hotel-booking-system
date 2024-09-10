import { Resend } from "resend";

console.log("Resend API Key", process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  return resend.emails.send({
    from: "noreply@sst.codingseas.in",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href=${verificationLink}>here</a> to verify your email.</p>`,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  return resend.emails.send({
    from: "noreply@sst.codingseas.in",
    to: email,
    subject: "Reset your Password",
    html: `<p>Click <a href=${resetLink}>here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  return resend.emails.send({
    from: "noreply@sst.codingseas.in",
    to: email,
    subject: "Two Factor Authentication",
    html: `<p>Your two factor authentication ${token}</p>`,
  });
};
