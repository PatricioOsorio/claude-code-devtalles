"use server";

import { Resend } from "resend";
import { env } from "@/lib/env";

export interface IContactState {
  status: "idle" | "error" | "sent";
  name?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContact(
  _prevState: IContactState,
  formData: FormData,
): Promise<IContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message || !EMAIL_REGEX.test(email)) {
    return { status: "error" };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Arcade Vault] Mensaje de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    });

    if (error) {
      console.error("[sendContact] Resend error:", error);
      return { status: "error" };
    }

    return { status: "sent", name };
  } catch (err) {
    console.error("[sendContact] Exception:", err);
    return { status: "error" };
  }
}
