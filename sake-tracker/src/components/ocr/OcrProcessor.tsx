"use client";

import { useEffect, useState } from "react";
import { extractSakeInfo } from "@/lib/ocr";
import type { OcrExtractedData } from "@/types/sake";

interface OcrProcessorProps {
  imageBlob: Blob;
  onComplete: (data: OcrExtractedData) => void;
  onError: () => void;
}

export default function OcrProcessor({
  imageBlob,
  onComplete,
  onError,
}: OcrProcessorProps) {
  const [status, setStatus] = useState("モデルを読み込み中...");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setStatus("ラベルを読み取り中...");
        const data = await extractSakeInfo(imageBlob);
        if (!cancelled) onComplete(data);
      } catch {
        if (!cancelled) onError();
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [imageBlob, onComplete, onError]);

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-300">{status}</p>
      <div className="w-64 h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-400 rounded-full animate-pulse w-2/3" />
      </div>
      <p className="text-sm text-gray-500">
        初回は日本語モデルのダウンロードに時間がかかります
      </p>
    </div>
  );
}
