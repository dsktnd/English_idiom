"use client";

import { useEffect, useRef } from "react";
import { useCamera } from "@/hooks/useCamera";
import Button from "@/components/ui/Button";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onFileSelect: (blob: Blob) => void;
}

export default function CameraCapture({
  onCapture,
  onFileSelect,
}: CameraCaptureProps) {
  const { videoRef, isActive, error, start, capture } = useCamera();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    start();
  }, [start]);

  const handleCapture = async () => {
    const blob = await capture();
    if (blob) onCapture(blob);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <svg
            className="w-16 h-16 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-400 text-center">{error}</p>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            写真を選択
          </Button>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden bg-navy-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCapture}
              disabled={!isActive}
              className="w-16 h-16 rounded-full border-4 border-cyan-400 bg-transparent hover:bg-cyan-400/20 active:bg-cyan-400/40 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-400" />
            </button>
          </div>
        </>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
      >
        ファイルから選択
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
