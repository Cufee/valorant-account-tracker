import { Result } from "../../types/result.d.ts";
import { tryCatch } from "../../utils/tryCatch.ts";
import { RemoteCredentials, RemoteRequestOptions } from "./types.d.ts";

const sendRequest = <T>(
  url: string,
  credentials: RemoteCredentials,
  opts?: RemoteRequestOptions,
): Promise<Result<T>> => {
  return tryCatch(async () => {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${credentials.token}`,
    };
    if (credentials.entitlement) {
      headers["X-Riot-Entitlements-JWT"] = credentials.entitlement;
    }
    if (opts?.clientVersion) {
      headers["X-Riot-ClientVersion"] = opts.clientVersion;
    }
    if (opts?.clientPlatform) {
      headers["X-Riot-ClientPlatform"] = opts?.clientPlatform;
    }
    const response = await fetch(url, { headers });
    if (response.status !== 200) {
      return { ok: false, message: `${url}: ${response.statusText}` };
    }

    return {
      ok: true,
      data: await response.json(),
    };
  }, `remote api request to ${url} failed`);
};

export default sendRequest;
