"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CameraCapture from "@/components/camera/CameraCapture";
import PhotoPreview from "@/components/camera/PhotoPreview";
import OcrProcessor from "@/components/ocr/OcrProcessor";
import SakeForm from "@/components/sake/SakeForm";
import Button from "@/components/ui/Button";
import { db } from "@/lib/db";
import { generateThumbnail } from "@/lib/camera";
import type { SakeFormData, OcrExtractedData } from "@/types/sake";

type Step = "capture" | "preview" | "ocr" | "form";

export default function AddSakePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("capture");
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [ocrData, setOcrData] = useState<OcrExtractedData>({});

  const handleCapture = (blob: Blob) => {
    setPhotoBlob(blob);
    setStep("preview");
  };

  const handleConfirmPhoto = () => {
    setStep("ocr");
  };

  const handleOcrComplete = useCallback((data: OcrExtractedData) => {
    setOcrData(data);
    setStep("form");
  }, []);

  const handleOcrError = useCallback(() => {
    setOcrData({});
    setStep("form");
  }, []);

  const handleSkipOcr = () => {
    setOcrData({});
    setStep("form");
  };

  const handleSubmit = async (formData: SakeFormData) => {
    const photo = photoBlob || undefined;
    const photoThumbnail = photo ? await generateThumbnail(photo) : undefined;

    await db.sakes.add({
      ...formData,
      photo,
      photoThumbnail,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    router.push("/");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === "capture") {
                router.push("/");
              } else if (step === "preview") {
                setStep("capture");
              } else if (step === "form") {
                setStep("preview");
              }
            }}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            ← 戻る
          </button>
          <h1 className="text-lg font-bold">
            {step === "capture" && "ラベルを撮影"}
            {step === "preview" && "写真の確認"}
            {step === "ocr" && "読み取り中"}
            {step === "form" && "情報を入力"}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {step === "capture" && (
          <CameraCapture
            onCapture={handleCapture}
            onFileSelect={handleCapture}
          />
        )}

        {step === "preview" && photoBlob && (
          <PhotoPreview
            blob={photoBlob}
            onConfirm={handleConfirmPhoto}
            onRetake={() => setStep("capture")}
          />
        )}

        {step === "ocr" && photoBlob && (
          <div className="flex flex-col items-center">
            <OcrProcessor
              imageBlob={photoBlob}
              onComplete={handleOcrComplete}
              onError={handleOcrError}
            />
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={handleSkipOcr}
            >
              スキップして手動入力
            </Button>
          </div>
        )}

        {step === "form" && (
          <SakeForm
            initialData={ocrData}
            photoBlob={photoBlob || undefined}
            onSubmit={handleSubmit}
            submitLabel="登録する"
          />
        )}
      </main>
    </div>
  );
}
