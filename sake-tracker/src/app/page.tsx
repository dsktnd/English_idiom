"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import SakeGrid from "@/components/sake/SakeGrid";
import { useSakeList } from "@/hooks/useSakeList";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const sakes = useSakeList(search);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-cyan-400">酒メモ</h1>
            <span className="text-sm text-gray-500">
              {sakes ? `${sakes.length}件` : ""}
            </span>
          </div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="銘柄・蔵元を検索..."
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        {sakes === undefined ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-navy-700/30 rounded-xl aspect-[3/4] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <SakeGrid sakes={sakes} />
        )}
      </main>

      <Link
        href="/add"
        className="fixed bottom-20 right-6 w-14 h-14 bg-cyan-400 rounded-full flex items-center justify-center text-navy-900 text-3xl font-light shadow-lg shadow-cyan-400/20 hover:bg-cyan-500 active:scale-90 transition-all z-50"
      >
        +
      </Link>
    </div>
  );
}
