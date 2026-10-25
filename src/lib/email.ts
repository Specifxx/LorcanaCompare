// Transactional email via Resend's REST API (as on Rift Compare).
import { SITE } from "@/site.config";

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email] RESEND_API_KEY not set — "${subject}" to ${to} was NOT sent.`);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || `${SITE.name} <alerts@${SITE.domain}>`, to, subject, html }),
  });
  if (!res.ok) console.warn(`[email] Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.ok;
}

const recent: number[] = [];
/** Tells the owner a public form was used; at most 20 a day per instance. */
export async function notifyOwnerBounded(subject: string, body: string) {
  const day = Date.now() - 86_400_000;
  while (recent.length && recent[0] < day) recent.shift();
  if (recent.length >= 20) return;
  recent.push(Date.now());
  await sendEmail(SITE.supportEmail, `[${SITE.name}] ${subject}`, `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(body)}</pre>`);
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
