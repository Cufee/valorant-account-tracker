import { RemoteCredentials, RemoteRequestOptions } from "./types.d.ts";

const sendApiRequest = async (
  url: string,
  credentials: RemoteCredentials,
  opts?: RemoteRequestOptions,
) => {
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
  return response.json();
};

export default sendApiRequest;
