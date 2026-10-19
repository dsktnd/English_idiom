"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import SakeForm from "@/components/sake/SakeForm";
import { useSake } from "@/hooks/useSake";
import { db } from "@/lib/db";
import { generateThumbnail } from "@/lib/camera";
import type { SakeFormData } from "@/types/sake";

export default function EditSakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const sakeId = Number(id);
  const sake = useSake(sakeId);

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

  const handleSubmit = async (formData: SakeFormData) => {
    const updates: Record<string, unknown> = {
      name: formData.name,
      brewery: formData.brewery,
      type: formData.type,
      polishingRatio: formData.polishingRatio,
      alcoholContent: formData.alcoholContent,
      prefecture: formData.prefecture,
      tastingDate: formData.tastingDate,
      rating: formData.rating,
      notes: formData.notes,
      updatedAt: new Date(),
    };

    if (formData.photo && formData.photo !== sake.photo) {
      updates.photo = formData.photo;
      updates.photoThumbnail = await generateThumbnail(formData.photo);
    }

    await db.sakes.update(sakeId, updates);
    router.push(`/sake/${sakeId}`);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push(`/sake/${sakeId}`)}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            ← 戻る
          </button>
          <h1 className="text-lg font-bold">編集</h1>
          <div className="w-10" />
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <SakeForm
          initialData={sake}
          photoBlob={sake.photo}
          onSubmit={handleSubmit}
          submitLabel="更新する"
        />
      </main>
    </div>
  );
}
