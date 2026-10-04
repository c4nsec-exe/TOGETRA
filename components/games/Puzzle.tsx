"use client";

import { useRouter } from "next/navigation";
import PuzzleGame from "../../../components/games/Puzzle";

export default function PuzzlePage() {
  const router = useRouter();

  return (
    <PuzzleGame
      onBack={() => router.back()}
    />
  );
}