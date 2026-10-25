// The operational database: PRIVATE data only (accounts, alerts, clicks).
// Egress rules, from Rift Compare's lib/db.ts:
//   1. No public page reads the database. Public data is in data/ (lib/data.ts).
//   2. Every query selects the columns it needs and is bounded (take / where).
//   3. Nothing database-backed is prerendered at build time.
//   4. No new page, layout or route revalidates under 21600 seconds.
import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };

export const dbConfigured = () => !!process.env.DATABASE_URL;

export const prisma: PrismaClient = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
