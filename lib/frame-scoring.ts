export type DetailedFrameInput = {
  frameNumber: number;
  roll1: number;
  roll2: number | null;
  roll3: number | null;
  frameScore: number;
};

type ValidationResult =
  | { valid: true }
  | {
      valid: false;
      message: string;
    };

function isIntegerInRange(value: number | null | undefined, min: number, max: number) {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

export function validateDetailedFrames(frames: DetailedFrameInput[]): ValidationResult {
  if (frames.length !== 10) {
    return { valid: false, message: "Detailed mode requires all 10 frames." };
  }

  let lastBoardScore = -1;

  for (const [index, frame] of frames.entries()) {
    const expectedFrameNumber = index + 1;

    if (frame.frameNumber !== expectedFrameNumber) {
      return { valid: false, message: "Frame numbers must run from 1 to 10 in order." };
    }

    if (!isIntegerInRange(frame.roll1, 0, 10)) {
      return { valid: false, message: `Frame ${expectedFrameNumber}: roll 1 must be between 0 and 10.` };
    }

    if (!isIntegerInRange(frame.frameScore, 0, 300)) {
      return {
        valid: false,
        message: `Frame ${expectedFrameNumber}: board score must be between 0 and 300.`
      };
    }

    if (frame.frameScore < lastBoardScore) {
      return {
        valid: false,
        message: `Frame ${expectedFrameNumber}: board score cannot go down from the previous frame.`
      };
    }

    lastBoardScore = frame.frameScore;

    if (index < 9) {
      if (frame.roll1 === 10) {
        if (frame.roll2 !== null || frame.roll3 !== null) {
          return {
            valid: false,
            message: `Frame ${expectedFrameNumber}: strike frames before the 10th should only use roll 1.`
          };
        }

        continue;
      }

      if (!isIntegerInRange(frame.roll2, 0, 10)) {
        return {
          valid: false,
          message: `Frame ${expectedFrameNumber}: roll 2 must be filled in.`
        };
      }

      if (frame.roll1 + (frame.roll2 ?? 0) > 10) {
        return {
          valid: false,
          message: `Frame ${expectedFrameNumber}: roll 1 and roll 2 cannot add up to more than 10.`
        };
      }

      if (frame.roll3 !== null) {
        return {
          valid: false,
          message: `Frame ${expectedFrameNumber}: roll 3 is only used in the 10th frame.`
        };
      }

      continue;
    }

    if (!isIntegerInRange(frame.roll2, 0, 10)) {
      return { valid: false, message: "Frame 10: roll 2 must be filled in." };
    }

    if (frame.roll1 !== 10 && frame.roll1 + (frame.roll2 ?? 0) > 10) {
      return {
        valid: false,
        message: "Frame 10: roll 1 and roll 2 cannot add up to more than 10 unless roll 1 is a strike."
      };
    }

    const needsRoll3 = frame.roll1 === 10 || frame.roll1 + (frame.roll2 ?? 0) === 10;

    if (needsRoll3 && !isIntegerInRange(frame.roll3, 0, 10)) {
      return { valid: false, message: "Frame 10: roll 3 is required after a strike or spare." };
    }

    if (!needsRoll3 && frame.roll3 !== null) {
      return { valid: false, message: "Frame 10: roll 3 should be empty unless you earned a fill ball." };
    }

    if (frame.roll1 === 10 && frame.roll2 !== null && frame.roll2 < 10 && (frame.roll2 + (frame.roll3 ?? 0) > 10)) {
      return {
        valid: false,
        message: "Frame 10: if roll 2 is not a strike, rolls 2 and 3 cannot add up to more than 10."
      };
    }
  }

  return { valid: true };
}

export function summarizeDetailedFrames(frames: DetailedFrameInput[]) {
  let strikes = 0;
  let spares = 0;
  let opens = 0;

  for (const [index, frame] of frames.entries()) {
    const isTenth = index === 9;

    if (frame.roll1 === 10) {
      strikes += 1;
      continue;
    }

    const secondRoll = frame.roll2 ?? 0;

    if (frame.roll1 + secondRoll === 10) {
      spares += 1;
      continue;
    }

    if (!isTenth || frame.roll3 === null) {
      opens += 1;
    }
  }

  return {
    totalScore: frames[frames.length - 1]?.frameScore ?? 0,
    strikeCount: strikes,
    spareCount: spares,
    openCount: opens
  };
}
