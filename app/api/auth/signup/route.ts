import { NextResponse } from "next/server";
import { applySessionCookie, hashPassword } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json(
      { message: "Name, email, and password are all required." },
      { status: 400 }
    );
  }

  if (body.password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters long." },
      { status: 400 }
    );
  }

  if (!isDatabaseConfigured) {
    const response = NextResponse.json({
      message: "Demo account created for this session. Add DATABASE_URL to persist real users."
    });

    return applySessionCookie(response, {
      userId: `demo-${body.email.toLowerCase()}`,
      name: body.name,
      email: body.email.toLowerCase(),
      role: "MEMBER"
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() }
  });

  if (existingUser) {
    return NextResponse.json({ message: "That email is already registered." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash: hashPassword(body.password),
      role: "MEMBER",
      isActive: true
    }
  });

  const response = NextResponse.json({
    message: `Account created for ${user.name}.`
  });

  return applySessionCookie(response, {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
}
