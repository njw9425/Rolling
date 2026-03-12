import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { summarizeDetailedFrames, validateDetailedFrames, type DetailedFrameInput } from "@/lib/frame-scoring";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    playedAt?: string;
    centerName?: string;
    laneNumber?: number;
    totalScore?: number;
    strikeCount?: number;
    spareCount?: number;
    openCount?: number;
    note?: string;
    isDetailed?: boolean;
    frames?: DetailedFrameInput[];
  };

  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Please sign in before saving a game log." },
      { status: 401 }
    );
  }

  if (!body.playedAt || !body.centerName) {
    return NextResponse.json(
      { message: "Missing required fields. Please enter the date and bowling center." },
      { status: 400 }
    );
  }

  const playedAt = body.playedAt as string;
  const centerName = body.centerName as string;
  const isDetailed = body.isDetailed === true;
  let totalScore = body.totalScore as number;
  let strikeCount = body.strikeCount as number;
  let spareCount = body.spareCount as number;
  let openCount = body.openCount as number;

  if (isDetailed) {
    const frames = body.frames ?? [];
    const validation = validateDetailedFrames(frames);

    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const summary = summarizeDetailedFrames(frames);
    totalScore = summary.totalScore;
    strikeCount = summary.strikeCount;
    spareCount = summary.spareCount;
    openCount = summary.openCount;
  } else {
    const requiredFields = [body.totalScore, body.strikeCount, body.spareCount, body.openCount];

    if (requiredFields.some((value) => value === undefined || value === null)) {
      return NextResponse.json(
        { message: "Missing required fields. Please enter the score and core frame stats." },
        { status: 400 }
      );
    }
  }

  if (isDatabaseConfigured) {
    const game = await prisma.game.create({
      data: {
        userId: session.userId,
        playedAt: new Date(playedAt),
        centerName,
        laneNumber: body.laneNumber,
        totalScore,
        strikeCount,
        spareCount,
        openCount,
        note: body.note,
        isDetailed,
        frames:
          isDetailed && body.frames
            ? {
                create: body.frames.map((frame) => ({
                  frameNumber: frame.frameNumber,
                  roll1: frame.roll1,
                  roll2: frame.roll2,
                  roll3: frame.roll3,
                  frameScore: frame.frameScore
                }))
              }
            : undefined
      }
    });

    return NextResponse.json({
      message: `Saved game #${game.id} for ${session.name}.`,
      savedPreview: {
        playedAt: game.playedAt,
        totalScore: game.totalScore,
        strikeCount: game.strikeCount,
        spareCount: game.spareCount,
        openCount: game.openCount,
        isDetailed: game.isDetailed
      }
    });
  }

  return NextResponse.json({
    message: `Saved demo game log for ${session.name} at ${centerName}. Add DATABASE_URL to persist it in Prisma.`,
    savedPreview: {
      playedAt,
      totalScore,
      strikeCount,
      spareCount,
      openCount,
      isDetailed
    }
  });
}
