export interface Database {
  set: (table: string, key: string, value: unknown) => Promise<boolean>;
  get: (table: string, key: string) => Promise<unknown | null>;
  delete: (table: string, key: string) => Promise<void>;

  enqueue: (queue: string, payload: unknown) => Promise<boolean>;
  listenQueue: <T>(
    queue: string,
    callback: (payload: T) => void,
  ) => Promise<void>;
}
