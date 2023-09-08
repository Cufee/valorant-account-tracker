import { Result } from "../types/result.d.ts";

const tryCatch = async <T>(
  fn: () => Promise<Result<T>>,
  message: string,
): Promise<Result<T>> => {
  try {
    return await fn();
  } catch (error) {
    console.error(
      `${fn.name || "tryCatch"} failed with error:\n${JSON.stringify(error)}`,
    );
    return { ok: false, message };
  }
};

export { tryCatch };
