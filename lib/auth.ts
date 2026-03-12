import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type SessionRole = "ADMIN" | "MEMBER";

export type SessionUser = {
  userId: string;
  name: string;
  email: string;
  role: SessionRole;
};

type DemoAccount = SessionUser & {
  password: string;
};

const AUTH_COOKIE = "rolling_stones_session";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "rolling-stones-dev-secret";

export const demoAccounts: DemoAccount[] = [
  {
    userId: "demo-admin",
    name: "Rolling Stones Captain",
    email: "captain@rollingstones.club",
    role: "ADMIN",
    password: "bowling123!"
  },
  {
    userId: "demo-member",
    name: "Rolling Stones Member",
    email: "member@rollingstones.club",
    role: "MEMBER",
    password: "bowling123!"
  }
];

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  return createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(session: SessionUser) {
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function readSessionToken(token: string): SessionUser | null {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  if (signPayload(payload) !== signature) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(payload)) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return readSessionToken(token);
}

export function applySessionCookie(response: NextResponse, session: SessionUser) {
  response.cookies.set({
    name: AUTH_COOKIE,
    value: createSessionToken(session),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(hash, "hex");

  if (derivedKey.length !== storedKey.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedKey);
}

export function getDemoAccountByEmail(email: string) {
  return demoAccounts.find((account) => account.email.toLowerCase() === email.toLowerCase()) ?? null;
}
