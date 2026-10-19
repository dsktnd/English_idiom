"use client";

import type { SakeRecord } from "@/types/sake";
import SakeCard from "./SakeCard";

interface SakeGridProps {
  sakes: SakeRecord[];
}

export default function SakeGrid({ sakes }: SakeGridProps) {
  if (sakes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-6xl">🍶</span>
        <p className="text-gray-400 text-center">
          まだ日本酒が登録されていません
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {sakes.map((sake) => (
        <SakeCard key={sake.id} sake={sake} />
      ))}
    </div>
  );
}
