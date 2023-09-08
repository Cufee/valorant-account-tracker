import { Result } from "../../types/result.d.ts";
import { tryCatch } from "../../utils/tryCatch.ts";

type Versions = {
  manifestId: string;
  branch: string;
  version: string;
  buildVersion: string;
  engineVersion: string;
  riotClientVersion: string;
  riotClientBuild: string;
  buildDate: string;
};

const getCurrentVersions = (): Promise<Result<Versions>> => {
  return tryCatch(async () => {
    const response = await fetch("https://valorant-api.com/v1/version");
    const raw = await response.json();
    return {
      ok: true,
      data: raw.data,
    };
  }, "failed to get current version from remote api");
};

export { getCurrentVersions };
