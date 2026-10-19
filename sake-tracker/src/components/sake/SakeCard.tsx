"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import StarRating from "@/components/ui/StarRating";
import { useBlobUrl } from "@/hooks/useBlobUrl";
import type { SakeRecord } from "@/types/sake";

interface SakeCardProps {
  sake: SakeRecord;
}

export default function SakeCard({ sake }: SakeCardProps) {
  const thumbnailUrl = useBlobUrl(sake.photoThumbnail || sake.photo);

  return (
    <Link href={`/sake/${sake.id}`}>
      <Card hover>
        <div className="aspect-[3/4] bg-navy-800 relative">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={sake.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
              🍶
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
            <h3 className="text-sm font-bold text-white truncate">
              {sake.name || "無名"}
            </h3>
            {sake.brewery && (
              <p className="text-xs text-gray-300 truncate">{sake.brewery}</p>
            )}
          </div>
        </div>
        <div className="p-2.5 flex items-center justify-between">
          <StarRating value={sake.rating} readonly size="sm" />
          <span className="text-xs text-gray-500">{sake.tastingDate}</span>
        </div>
      </Card>
    </Link>
  );
}
