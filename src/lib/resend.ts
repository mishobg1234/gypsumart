import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = "Gypsumart <onboarding@resend.dev>"; // Промени с твоя домейн когато е готов
