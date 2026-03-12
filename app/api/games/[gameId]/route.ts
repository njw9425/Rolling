import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getManagedGameOrResponse } from "@/lib/game-access";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

type GameBody = {
  playedAt?: string;
  centerName?: string;
  laneNumber?: number | null;
  totalScore?: number;
  strikeCount?: number;
  spareCount?: number;
  openCount?: number;
  note?: string;
};

function validateBody(body: GameBody) {
  const requiredFields = [
    body.playedAt,
    body.centerName,
    body.totalScore,
    body.strikeCount,
    body.spareCount,
    body.openCount
  ];

  return !requiredFields.some((value) => value === undefined || value === null || value === "");
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Please sign in first." }, { status: 401 });
  }

  const { gameId } = await context.params;
  const body = (await request.json()) as GameBody;

  if (!validateBody(body)) {
    return NextResponse.json(
      { message: "Please fill in the score and core frame stats before saving." },
      { status: 400 }
    );
  }

  if (!isDatabaseConfigured) {
    return NextResponse.json({
      message: "Demo mode updated this record in the current session view only.",
      game: {
        id: gameId,
        playedAt: body.playedAt,
        centerName: body.centerName,
        laneNumber: body.laneNumber,
        totalScore: body.totalScore,
        strikeCount: body.strikeCount,
        spareCount: body.spareCount,
        openCount: body.openCount,
        note: body.note ?? ""
      }
    });
  }

  const { response } = await getManagedGameOrResponse(gameId, session);

  if (response) {
    return response;
  }

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      playedAt: new Date(body.playedAt as string),
      centerName: body.centerName as string,
      laneNumber: body.laneNumber ?? null,
      totalScore: body.totalScore as number,
      strikeCount: body.strikeCount as number,
      spareCount: body.spareCount as number,
      openCount: body.openCount as number,
      note: body.note ?? ""
    }
  });

  return NextResponse.json({
    message: "Game record updated.",
    game: updatedGame
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Please sign in first." }, { status: 401 });
  }

  const { gameId } = await context.params;

  if (!isDatabaseConfigured) {
    return NextResponse.json({
      message: "Demo mode removed this record from the current session view only.",
      deletedId: gameId
    });
  }

  const { response } = await getManagedGameOrResponse(gameId, session);

  if (response) {
    return response;
  }

  await prisma.game.delete({
    where: { id: gameId }
  });

  return NextResponse.json({
    message: "Game record deleted.",
    deletedId: gameId
  });
}
