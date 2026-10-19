"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function useSakeList(searchQuery: string) {
  return useLiveQuery(() => {
    const collection = db.sakes.orderBy("createdAt").reverse();
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return collection
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.brewery.toLowerCase().includes(q),
        )
        .toArray();
    }
    return collection.toArray();
  }, [searchQuery]);
}
