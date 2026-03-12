import { NextResponse } from "next/server";
import { applySessionCookie, getDemoAccountByEmail, verifyPassword } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  if (!isDatabaseConfigured) {
    const demoAccount = getDemoAccountByEmail(body.email);

    if (!demoAccount || demoAccount.password !== body.password) {
      return NextResponse.json(
        { message: "Invalid credentials. Use the demo account shown on the login page." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: `Signed in as ${demoAccount.name} in demo mode.`
    });

    return applySessionCookie(response, {
      userId: demoAccount.userId,
      name: demoAccount.name,
      email: demoAccount.email,
      role: demoAccount.role
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() }
  });

  if (!user || !verifyPassword(body.password, user.passwordHash)) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  if (!user.isActive) {
    return NextResponse.json(
      { message: "This account has been deactivated. Please contact a club admin." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({
    message: `Welcome back, ${user.name}.`
  });

  return applySessionCookie(response, {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
}
