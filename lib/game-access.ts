import { NextResponse } from "next/server";
import type { SessionUser } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export function canManageGame(session: SessionUser, ownerUserId: string) {
  return session.role === "ADMIN" || session.userId === ownerUserId;
}

export async function getManagedGameOrResponse(gameId: string, session: SessionUser) {
  if (!isDatabaseConfigured) {
    return { game: null, response: null };
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId }
  });

  if (!game) {
    return {
      game: null,
      response: NextResponse.json({ message: "Game not found." }, { status: 404 })
    };
  }

  if (!canManageGame(session, game.userId)) {
    return {
      game: null,
      response: NextResponse.json(
        { message: "You can only manage your own records unless you are an admin." },
        { status: 403 }
      )
    };
  }

  return { game, response: null };
}
