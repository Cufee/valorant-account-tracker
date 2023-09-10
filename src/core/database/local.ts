import { Database } from "./types.d.ts";
import { resolve } from "https://deno.land/std@0.201.0/path/mod.ts";

const databasePath = resolve(
  `${Deno.env.get("HOMEDRIVE")}/${
    Deno.env.get("HOMEPATH")
  }/valorant-account-tracker`,
);

// Ensure the database path exists
try {
  Deno.statSync(databasePath);
} catch (_) {
  Deno.mkdirSync(databasePath, { recursive: true });
}

const kv = await Deno.openKv(databasePath + "/database");

type Object<T = unknown> = {
  data: T;
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

  async get<T>(table: string, key: string): Promise<T | null> {
    const result = await this.storage.get([table, key]);
    if (result.versionstamp === null || !result.value) return null;
    return (result.value as Object<T>).data;
  }

  async list<T>(table: string) {
    const results = await this.storage.list({ prefix: [table] });
    const values: T[] = [];
    for await (const res of results) values.push((res.value as Object<T>).data);
    return values;
  }

  async delete(table: string, key: string): Promise<void> {
    return await this.storage.delete([table, key]);
  }

  async enqueue(queue: string, payload: unknown): Promise<boolean> {
    const result = await this.storage.enqueue([queue, payload]);
    return result.ok;
  }

  async listenQueue<T>(queue: string, callback: (payload: T) => void) {
    return await this.storage.listenQueue((message) => {
      const [name, payload] = message as [string, T];
      if (name === queue) callback(payload);
    });
  }
}

export default LocalDB;
