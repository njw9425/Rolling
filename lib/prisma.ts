import { PrismaClient } from "@prisma/client/index";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
