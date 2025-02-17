import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;


export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Veuillez confirmer votre email",
    html: `<p>Cliquez <a href="${confirmLink}">ici</a> pour confirmer votre mail</p>`,
  });
};
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Réinitiliaser son mot de passe",
    html: `<p>Cliquez <a href="${resetLink}">ici</a> pour réinitiliaser votre mot de passe.</p>`,
  });
};
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Votre code 2FA: ${token}</p>`,
  });
};
