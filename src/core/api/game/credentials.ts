import { resolve } from "https://deno.land/std@0.201.0/path/mod.ts";
import { encode } from "https://deno.land/std@0.194.0/encoding/base64.ts";

const defaultPath = `${
  Deno.env.get("LocalAppData")
}\\Riot Games\\Riot Client\\Config\\lockfile`;

type GameCredentials = {
  http: {
    endpoint: string;
    authHeader: string;
  };
  wss: {
    endpoint: string;
  };
};

const lockfileWatchDebounceMs = 1000;
let credentialsCache: GameCredentials | null = null;
let lastLockfileChange = Date.now();

const watchLockfile = async () => {
  const watcher = Deno.watchFs(resolve(defaultPath), { recursive: false });
  for await (const op of watcher) {
    const shouldIgnore =
      Date.now() - lastLockfileChange < lockfileWatchDebounceMs;
    lastLockfileChange = Date.now();

    if (shouldIgnore || op.kind === "remove") continue;
    credentialsCache = loadGameCredentials();
    console.error("game credentials have changed, cache was updated");
  }
};
watchLockfile();

const loadGameCredentials = (): GameCredentials => {
  const lockfile = Deno.readTextFileSync(resolve(defaultPath));

  // name:pid:port:password:protocol
  const [_, __, gamePort, gamePassword, protocol] = lockfile.split(":");
  const gameEndpointUrl = `${protocol}://127.0.0.1:${gamePort}`;
  const gameWebsocketUrl = `wss://riot:${gamePassword}@127.0.0.1:${gamePort}`;

  return {
    http: {
      endpoint: gameEndpointUrl,
      authHeader: `Basic ${encode("riot:" + gamePassword)}`,
    },
    wss: {
      endpoint: gameWebsocketUrl,
    },
  };
};

const getGameCredentials = (): GameCredentials => {
  if (!credentialsCache) {
    credentialsCache = loadGameCredentials();
  }
  return credentialsCache;
};

export { getGameCredentials };
