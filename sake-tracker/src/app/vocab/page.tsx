"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { VIDEO_ID, IDIOMS, CHAPTERS, type Idiom } from "@/lib/vocab-data";

declare global {
  interface Window {
    YT: {
      Player: new (
        el: string,
        opts: Record<string, unknown>,
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  seekTo: (sec: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setPlaybackRate: (rate: number) => void;
  getCurrentTime: () => number;
  destroy: () => void;
}

function formatSec(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

const SPEEDS = [1.0, 0.75, 1.25];
const STORAGE_KEY = "idioms_Myp2On95hJM";

function loadLearned(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export default function VocabPage() {
  const playerRef = useRef<YTPlayer | null>(null);
  const playerReadyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLoopingRef = useRef(true);

  const [currentClip, setCurrentClip] = useState<Idiom | null>(null);
  const [isLooping, setIsLooping] = useState(true);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [lesson, setLesson] = useState("all");
  const [hideMode, setHideMode] = useState(false);
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);
  const [learnedSet, setLearnedSet] = useState<Set<number>>(() => loadLearned());
  const [unmaskedIds, setUnmaskedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...learnedSet]));
    } catch { /* ignore */ }
  }, [learnedSet]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.YT) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: VIDEO_ID,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            playerReadyRef.current = true;
          },
        },
      });
    };

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const playClip = useCallback(
    (item: Idiom) => {
      setCurrentClip(item);

      const p = playerRef.current;
      if (playerReadyRef.current && p) {
        p.setPlaybackRate(SPEEDS[speedIdx]);
        p.seekTo(item.sec, true);
        p.playVideo();
      }

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const pl = playerRef.current;
        if (!playerReadyRef.current || !pl) return;
        const t = pl.getCurrentTime();
        if (t >= item.endSec) {
          if (isLoopingRef.current) {
            pl.seekTo(item.sec, true);
            pl.playVideo();
          } else {
            pl.pauseVideo();
            if (timerRef.current) clearInterval(timerRef.current);
          }
        }
      }, 250);
    },
    [speedIdx],
  );

  const toggleLearned = (id: number) => {
    setLearnedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleUnmasked = (id: number) => {
    if (!hideMode) return;
    setUnmaskedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const changeSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    if (playerReadyRef.current && playerRef.current) {
      playerRef.current.setPlaybackRate(SPEEDS[next]);
    }
  };

  const q = search.toLowerCase();
  const filtered = IDIOMS.filter((item) => {
    if (lesson !== "all" && String(item.lesson) !== lesson) return false;
    if (onlyUnlearned && learnedSet.has(item.id)) return false;
    if (
      q &&
      !item.phrase.toLowerCase().includes(q) &&
      !item.meaning.toLowerCase().includes(q) &&
      !item.note.toLowerCase().includes(q) &&
      !item.exEn.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  const ytHost = "https://www.youtube.com";

  return (
    <div className="min-h-screen pb-20" style={{ background: "#f1f5f9", color: "#0f172a" }}>
      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-40"
        style={{
          background: "rgba(15, 23, 42, 0.96)",
          color: "#fff",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          padding: "12px 20px",
        }}
      >
        <div
          className="max-w-[1140px] mx-auto grid gap-5 items-center vocab-top-grid"
        >
          <div
            className="relative w-full bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: "16/9", border: "1px solid #334155" }}
          >
            <div id="yt-player" className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Now playing box */}
            <div
              className="rounded-md"
              style={{
                background: "rgba(255,255,255,0.08)",
                borderLeft: "4px solid #db2777",
                padding: "8px 12px",
              }}
            >
              <div className="flex justify-between flex-wrap gap-2" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                <span>
                  {currentClip
                    ? `▶ シーン切り抜き再生中 (Ch.${currentClip.lesson})`
                    : "🎬 カードの「▶ 切り抜き」を押すと該当シーンをループ再生します"}
                </span>
                <span>
                  {currentClip
                    ? `${formatSec(currentClip.sec)} 〜 ${formatSec(currentClip.endSec)}`
                    : "--:-- 〜 --:--"}
                </span>
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginTop: 2 }}>
                {currentClip
                  ? `${currentClip.phrase} （${currentClip.meaning}）`
                  : "フレーズ未選択 (i woke up at 5am for a week)"}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: 2 }}>
                {currentClip
                  ? `${currentClip.exEn} / ${currentClip.exJa}`
                  : "英文と日本語訳がここに表示されます"}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索 (英語・日本語)..."
                className="flex-1 min-w-[140px]"
                style={{
                  padding: "6px 10px",
                  border: "1px solid #475569",
                  background: "#1e293b",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                }}
              />
              <select
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #475569",
                  background: "#1e293b",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                }}
              >
                {CHAPTERS.map((ch) => (
                  <option key={ch.value} value={ch.value}>
                    {ch.label}
                  </option>
                ))}
              </select>

              <VBtn active={isLooping} onClick={() => setIsLooping((v) => !v)}>
                🔁 ループ: {isLooping ? "ON" : "OFF"}
              </VBtn>
              <VBtn onClick={changeSpeed}>⚡ 速度: {SPEEDS[speedIdx]}x</VBtn>
              <VBtn onClick={() => currentClip && playClip(currentClip)}>⏮ 頭出し</VBtn>
              <VBtn
                active={hideMode}
                onClick={() => {
                  setHideMode((v) => !v);
                  setUnmaskedIds(new Set());
                }}
              >
                🙈 意味を隠す
              </VBtn>
              <VBtn active={onlyUnlearned} onClick={() => setOnlyUnlearned((v) => !v)}>
                📌 未習得のみ
              </VBtn>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8", marginLeft: "auto" }}>
                習得: {learnedSet.size} / {IDIOMS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="max-w-[1140px] mx-auto px-5 py-5">
        <div
          className="grid gap-3.5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}
        >
          {filtered.map((item, idx) => {
            const isPlaying = currentClip?.id === item.id;
            const isLearned = learnedSet.has(item.id);
            const isMasked = hideMode && !unmaskedIds.has(item.id);

            return (
              <div
                key={item.id}
                className="flex flex-col gap-2 transition-all"
                style={{
                  background: isPlaying ? "#eff6ff" : isLearned ? "#f8fafc" : "#fff",
                  border: `2px solid ${isPlaying ? "#2563eb" : "#e2e8f0"}`,
                  borderRadius: 10,
                  padding: 14,
                  opacity: isLearned ? 0.65 : 1,
                  boxShadow: isPlaying ? "0 4px 12px rgba(37,99,235,0.12)" : undefined,
                }}
              >
                {/* Card header */}
                <div className="flex justify-between items-center gap-1.5 flex-wrap">
                  <div className="flex gap-1.5 items-center">
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: "#e2e8f0",
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      No.{idx + 1} (Ch.{item.lesson})
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: "#fdf2f8",
                        color: "#db2777",
                        fontWeight: 600,
                      }}
                    >
                      {item.pos}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => playClip(item)}
                      style={{
                        background: isPlaying ? "#db2777" : "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "4px 9px",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {isPlaying ? "🔊 再生中" : "▶ 切り抜き"} ({formatSec(item.sec)}〜
                      {formatSec(item.endSec)})
                    </button>
                    <a
                      href={`${ytHost}/watch?v=${VIDEO_ID}&t=${item.sec}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="別タブで該当秒数から開く"
                      style={{
                        background: "#e2e8f0",
                        color: "#334155",
                        border: "none",
                        borderRadius: 6,
                        padding: "4px 7px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ↗
                    </a>
                  </div>
                </div>

                {/* Phrase */}
                <div style={{ fontSize: "1.18rem", fontWeight: 700, color: "#0f172a" }}>
                  {item.phrase}
                </div>

                {/* Answer area */}
                <div
                  onClick={() => toggleUnmasked(item.id)}
                  style={{
                    borderTop: "1px dashed #e2e8f0",
                    paddingTop: 8,
                    cursor: hideMode ? "pointer" : "default",
                    filter: isMasked ? "blur(6px)" : "none",
                    userSelect: isMasked ? "none" : "auto",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#db2777", fontSize: "0.95rem", marginBottom: 4 }}>
                    {item.meaning}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#334155", marginBottom: 8 }}>
                    {item.note}
                  </div>
                  <div
                    style={{
                      background: "rgba(241,245,249,0.8)",
                      padding: "8px 10px",
                      borderRadius: 6,
                      fontSize: "0.8rem",
                      borderLeft: "3px solid #94a3b8",
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{item.exEn}</div>
                    <div style={{ color: "#64748b", marginTop: 2 }}>{item.exJa}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto pt-1">
                  <label
                    className="flex items-center gap-1 cursor-pointer select-none"
                    style={{ fontSize: "0.8rem", color: "#64748b" }}
                  >
                    <input
                      type="checkbox"
                      checked={isLearned}
                      onChange={() => toggleLearned(item.id)}
                    />
                    覚えた
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 10px",
        border: "1px solid #475569",
        background: active ? "#db2777" : "#1e293b",
        color: active ? "#fff" : "#e2e8f0",
        borderColor: active ? "#db2777" : "#475569",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: "0.8rem",
        fontWeight: 600,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
