export type Result<T> = {
  ok: false;
  message: string;
} | {
  ok: true;
  data: T;
};
