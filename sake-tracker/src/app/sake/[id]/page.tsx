"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import SakeDetail from "@/components/sake/SakeDetail";
import { useSake } from "@/hooks/useSake";

export default function SakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const sake = useSake(Number(id));

  if (sake === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!sake) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">この日本酒は見つかりませんでした</p>
        <button
          onClick={() => router.push("/")}
          className="text-cyan-400 hover:underline"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            ← 戻る
          </button>
          <h1 className="text-lg font-bold truncate max-w-[200px]">
            {sake.name}
          </h1>
          <div className="w-10" />
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <SakeDetail sake={sake} />
      </main>
    </div>
  );
}
