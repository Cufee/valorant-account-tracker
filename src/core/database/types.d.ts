export interface Database {
  set: (table: string, key: string, value: unknown) => Promise<boolean>;
  get: (table: string, key: string) => Promise<unknown | null>;
  delete: (table: string, key: string) => Promise<void>;
}
