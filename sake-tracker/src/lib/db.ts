import Dexie, { type Table } from "dexie";
import type { SakeRecord } from "@/types/sake";

class SakeDatabase extends Dexie {
  sakes!: Table<SakeRecord>;

  constructor() {
    super("SakeTrackerDB");
    this.version(1).stores({
      sakes: "++id, name, brewery, type, prefecture, tastingDate, rating, createdAt",
    });
  }
}

export const db = new SakeDatabase();
