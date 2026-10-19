export interface SakeRecord {
  id?: number;
  photo?: Blob;
  photoThumbnail?: Blob;
  name: string;
  brewery: string;
  type: string;
  polishingRatio: string;
  alcoholContent: string;
  prefecture: string;
  tastingDate: string;
  rating: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SakeFormData {
  photo?: Blob;
  name: string;
  brewery: string;
  type: string;
  polishingRatio: string;
  alcoholContent: string;
  prefecture: string;
  tastingDate: string;
  rating: number;
  notes: string;
}

export interface OcrExtractedData {
  name?: string;
  brewery?: string;
  type?: string;
  polishingRatio?: string;
  alcoholContent?: string;
  prefecture?: string;
}
