import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = `${process.env.APP_NAME} <${process.env.FROM_EMAIL}>` ; // Промени с твоя домейн когато е готов
