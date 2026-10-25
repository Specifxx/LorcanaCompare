import { SITE } from "@/site.config";

// Hard-coded owner admin (owner, 2026-10-24: "just make bill.jyang101@gmail.com
// the admin. I just hard code that in"). ADMIN_EMAILS adds more, never removes.
export const ADMIN_EMAILS = [
  ...SITE.adminEmails,
  ...(process.env.ADMIN_EMAILS ?? "").split(","),
]
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
