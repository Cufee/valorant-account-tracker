import { Database } from "./types.d.ts";

const kv = await Deno.openKv("./data/database");

type Object = {
  data: unknown;
};

class LocalDB implements Database {
  private static _instance: LocalDB = new LocalDB();
  private storage = kv;

  constructor() {
    if (LocalDB._instance) throw "use Database.connect() instead";
    LocalDB._instance = this;
  }

  static connect() {
    if (!LocalDB._instance) return new LocalDB();
    return LocalDB._instance;
  }

  async set(table: string, key: string, value: unknown): Promise<boolean> {
    const data: Object = { data: value };
    const result = await this.storage.set([table, key], data);
    return result.ok;
  }

  async get(table: string, key: string): Promise<unknown | null> {
    const result = await this.storage.get([table, key]);
    if (result.versionstamp === null || !result.value) return null;
    return (result.value as Object).data;
  }

  async delete(table: string, key: string): Promise<void> {
    return this.storage.delete([table, key]);
  }
}

export default LocalDB;
