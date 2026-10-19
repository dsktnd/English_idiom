import { createWorker, type Worker } from "tesseract.js";
import type { OcrExtractedData } from "@/types/sake";
import { SAKE_TYPES, PREFECTURES } from "./sake-types";

let worker: Worker | null = null;

async function getWorker(): Promise<Worker> {
  if (!worker) {
    worker = await createWorker("jpn");
  }
  return worker;
}

export async function extractSakeInfo(
  imageBlob: Blob,
): Promise<OcrExtractedData> {
  const w = await getWorker();
  const result = await w.recognize(imageBlob);
  const text = result.data.text;
  return parseSakeText(text);
}

export function parseSakeText(text: string): OcrExtractedData {
  const extracted: OcrExtractedData = {};

  for (const sakeType of SAKE_TYPES) {
    if (text.includes(sakeType)) {
      extracted.type = sakeType;
      break;
    }
  }

  const polishMatch = text.match(/精米歩合\s*[:：]?\s*(\d+)\s*[%％]?/);
  if (polishMatch) {
    extracted.polishingRatio = polishMatch[1] + "%";
  }

  const alcoholMatch = text.match(
    /アルコール[分度]?\s*[:：]?\s*(\d+\.?\d*)\s*[%％度]?/,
  );
  if (alcoholMatch) {
    extracted.alcoholContent = alcoholMatch[1] + "%";
  }

  for (const pref of PREFECTURES) {
    if (text.includes(pref)) {
      extracted.prefecture = pref;
      break;
    }
  }

  const breweryMatch = text.match(
    /(?:製造者|醸造元|蔵元)\s*[:：]?\s*(.+?)[\n\r]/,
  );
  if (breweryMatch) {
    extracted.brewery = breweryMatch[1].trim();
  }

  return extracted;
}

export async function terminateOcrWorker(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}
