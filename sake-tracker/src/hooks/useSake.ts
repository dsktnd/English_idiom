"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function useSake(id: number) {
  return useLiveQuery(() => db.sakes.get(id), [id]);
}
