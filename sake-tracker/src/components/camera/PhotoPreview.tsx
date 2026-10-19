"use client";

import { useBlobUrl } from "@/hooks/useBlobUrl";
import Button from "@/components/ui/Button";

interface PhotoPreviewProps {
  blob: Blob;
  onConfirm: () => void;
  onRetake: () => void;
}

export default function PhotoPreview({
  blob,
  onConfirm,
  onRetake,
}: PhotoPreviewProps) {
  const url = useBlobUrl(blob);

  if (!url) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden bg-navy-800">
        <img src={url} alt="撮影した写真" className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onRetake}>
          撮り直す
        </Button>
        <Button onClick={onConfirm}>この写真を使う</Button>
      </div>
    </div>
  );
}
