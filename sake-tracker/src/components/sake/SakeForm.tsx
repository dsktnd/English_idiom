"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import { useBlobUrl } from "@/hooks/useBlobUrl";
import { SAKE_TYPES, PREFECTURES } from "@/lib/sake-types";
import type { SakeFormData } from "@/types/sake";

interface SakeFormProps {
  initialData?: Partial<SakeFormData>;
  photoBlob?: Blob;
  onSubmit: (data: SakeFormData) => void;
  submitLabel?: string;
}

export default function SakeForm({
  initialData,
  photoBlob,
  onSubmit,
  submitLabel = "保存",
}: SakeFormProps) {
  const [formData, setFormData] = useState<SakeFormData>({
    name: initialData?.name ?? "",
    brewery: initialData?.brewery ?? "",
    type: initialData?.type ?? "",
    polishingRatio: initialData?.polishingRatio ?? "",
    alcoholContent: initialData?.alcoholContent ?? "",
    prefecture: initialData?.prefecture ?? "",
    tastingDate:
      initialData?.tastingDate ?? new Date().toISOString().split("T")[0],
    rating: initialData?.rating ?? 0,
    notes: initialData?.notes ?? "",
    photo: photoBlob,
  });

  const photoUrl = useBlobUrl(photoBlob);

  const update = (field: keyof SakeFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {photoUrl && (
        <div className="w-full max-w-xs mx-auto aspect-[3/4] rounded-xl overflow-hidden bg-navy-800">
          <img
            src={photoUrl}
            alt="ラベル写真"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Input
        label="銘柄"
        placeholder="例: 獺祭"
        value={formData.name}
        onChange={(e) => update("name", e.target.value)}
        required
      />

      <Input
        label="蔵元・製造者"
        placeholder="例: 旭酒造株式会社"
        value={formData.brewery}
        onChange={(e) => update("brewery", e.target.value)}
      />

      <Select
        label="種類"
        options={SAKE_TYPES}
        placeholder="選択してください"
        value={formData.type}
        onChange={(e) => update("type", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="精米歩合"
          placeholder="例: 50%"
          value={formData.polishingRatio}
          onChange={(e) => update("polishingRatio", e.target.value)}
        />
        <Input
          label="アルコール度数"
          placeholder="例: 16%"
          value={formData.alcoholContent}
          onChange={(e) => update("alcoholContent", e.target.value)}
        />
      </div>

      <Select
        label="産地"
        options={PREFECTURES}
        placeholder="選択してください"
        value={formData.prefecture}
        onChange={(e) => update("prefecture", e.target.value)}
      />

      <Input
        label="飲んだ日"
        type="date"
        value={formData.tastingDate}
        onChange={(e) => update("tastingDate", e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-gray-400 font-medium">評価</label>
        <StarRating
          value={formData.rating}
          onChange={(v) => update("rating", v)}
        />
      </div>

      <Textarea
        label="メモ"
        placeholder="味の感想など..."
        rows={3}
        value={formData.notes}
        onChange={(e) => update("notes", e.target.value)}
      />

      <Button type="submit" size="lg" className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
