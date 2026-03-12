import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

type MemberRole = "ADMIN" | "MEMBER";

type MemberUpdateBody = {
  role?: MemberRole;
  isActive?: boolean;
};

function isValidRole(role: unknown): role is MemberRole {
  return role === "ADMIN" || role === "MEMBER";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Admin access is required." }, { status: 403 });
  }

  const { userId } = await context.params;
  const body = (await request.json()) as MemberUpdateBody;

  if (body.role !== undefined && !isValidRole(body.role)) {
    return NextResponse.json({ message: "Invalid role provided." }, { status: 400 });
  }

  if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
    return NextResponse.json({ message: "Invalid active status provided." }, { status: 400 });
  }

  if (body.role === undefined && body.isActive === undefined) {
    return NextResponse.json({ message: "Nothing to update." }, { status: 400 });
  }

  if (!isDatabaseConfigured) {
    const nextRole = body.role ?? (userId === "demo-admin" ? "ADMIN" : "MEMBER");
    const nextIsActive = body.isActive ?? true;

    if (session.userId === userId && (nextRole !== "ADMIN" || !nextIsActive)) {
      return NextResponse.json(
        { message: "You cannot remove your own admin access in demo mode." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Demo mode updated this member in the current session view only.",
      member: {
        id: userId,
        role: nextRole,
        isActive: nextIsActive
      }
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return NextResponse.json({ message: "Member not found." }, { status: 404 });
  }

  const nextRole = body.role ?? user.role;
  const nextIsActive = body.isActive ?? user.isActive;

  if (session.userId === user.id && (nextRole !== "ADMIN" || !nextIsActive)) {
    return NextResponse.json(
      { message: "You cannot remove your own admin access while signed in." },
      { status: 400 }
    );
  }

  if (user.role === "ADMIN" && (nextRole !== "ADMIN" || !nextIsActive)) {
    const otherActiveAdmins = await prisma.user.count({
      where: {
        id: {
          not: user.id
        },
        role: "ADMIN",
        isActive: true
      }
    });

    if (otherActiveAdmins === 0) {
      return NextResponse.json(
        { message: "At least one active admin must remain in the club." },
        { status: 400 }
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      role: nextRole,
      isActive: nextIsActive
    }
  });

  return NextResponse.json({
    message: "Member updated.",
    member: {
      id: updatedUser.id,
      role: updatedUser.role,
      isActive: updatedUser.isActive
    }
  });
}
