"use client";

import { durationCss } from "@/lib/motion/tokens";

type Props = {
  current: string;
  previous: string;
  x: number;
  y: number;
  tick: number;
};

/** Incoming atmosphere opens from the click as a clip-path wash. */
export function MoodWash({ current, previous, x, y, tick }: Props) {
  return (
    <>
      <div className={`quiz-stage__wash quiz-stage__wash--base ${previous}`} aria-hidden="true" />
      <div
        key={tick}
        className={`quiz-stage__wash quiz-stage__wash--from-click quiz-stage__wash--loud ${current}`}
        style={{
          ["--wash-x" as string]: `${x}%`,
          ["--wash-y" as string]: `${y}%`,
          animationDuration: durationCss("standard"),
        }}
        aria-hidden="true"
      />
    </>
  );
}
