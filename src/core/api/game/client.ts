import { join } from "https://deno.land/std@0.201.0/path/join.ts";
import { getGameCredentials } from "./credentials.ts";
import { Result } from "../../types/result.d.ts";
import { tryCatch } from "../../utils/tryCatch.ts";

const sendRequest = <T>(path: string): Promise<Result<T>> => {
  return tryCatch(async () => {
    const credentials = await getGameCredentials();
    if (!credentials.ok) {
      return credentials;
    }

    const response = await fetch(join(credentials.data.http.endpoint, path), {
      headers: {
        "Authorization": credentials.data.http.authHeader,
      },
    });
    if (response.status !== 200) {
      return { ok: false, message: `${path}: ${response.statusText}` };
    }

    return { ok: true, data: await response.json() };
  }, `game api request to ${path} failed`);
};
export default sendRequest;
