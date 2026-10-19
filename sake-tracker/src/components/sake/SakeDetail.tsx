"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useBlobUrl } from "@/hooks/useBlobUrl";
import { db } from "@/lib/db";
import type { SakeRecord } from "@/types/sake";

interface SakeDetailProps {
  sake: SakeRecord;
}

export default function SakeDetail({ sake }: SakeDetailProps) {
  const router = useRouter();
  const photoUrl = useBlobUrl(sake.photo);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    if (sake.id) {
      await db.sakes.delete(sake.id);
      router.push("/");
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <div className="flex justify-between py-2.5 border-b border-white/5">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-gray-100 text-sm font-medium">{value}</span>
      </div>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      {photoUrl && (
        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-navy-800 relative">
          <img
            src={photoUrl}
            alt={sake.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
            <h1 className="text-2xl font-bold text-white">{sake.name}</h1>
            {sake.brewery && (
              <p className="text-sm text-gray-300 mt-1">{sake.brewery}</p>
            )}
          </div>
        </div>
      )}

      {!photoUrl && (
        <div>
          <h1 className="text-2xl font-bold">{sake.name}</h1>
          {sake.brewery && (
            <p className="text-sm text-gray-400 mt-1">{sake.brewery}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <StarRating value={sake.rating} readonly />
        <span className="text-sm text-gray-500">{sake.tastingDate}</span>
      </div>

      <div className="bg-navy-700/50 border border-white/10 rounded-xl p-4">
        <InfoRow label="種類" value={sake.type} />
        <InfoRow label="精米歩合" value={sake.polishingRatio} />
        <InfoRow label="アルコール度数" value={sake.alcoholContent} />
        <InfoRow label="産地" value={sake.prefecture} />
      </div>

      {sake.notes && (
        <div className="bg-navy-700/50 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">メモ</p>
          <p className="text-gray-200 whitespace-pre-wrap">{sake.notes}</p>
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push(`/sake/${sake.id}/edit`)}
        >
          編集
        </Button>
        <Button variant="danger" onClick={() => setShowDelete(true)}>
          削除
        </Button>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)}>
        <h3 className="text-lg font-bold mb-2">削除の確認</h3>
        <p className="text-gray-400 text-sm mb-4">
          「{sake.name}」を削除しますか？この操作は取り消せません。
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            キャンセル
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            削除する
          </Button>
        </div>
      </Modal>
    </div>
  );
}
