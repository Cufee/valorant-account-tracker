import { resolve } from "https://deno.land/std@0.201.0/path/mod.ts";
import { encode } from "https://deno.land/std@0.194.0/encoding/base64.ts";
import { Result } from "../../types/result.d.ts";
import { tryCatch } from "../../utils/tryCatch.ts";

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

const watchListenerCallbacks: Record<string, (() => void)> = {};
let watchListenerExists = false;

const onGameCredentialsUpdate = (...callbacks: [string, () => void][]) => {
  if (!watchListenerExists) {
    startLockfileWatchListener();
  }

  if (callbacks.length > 0) {
    for (const [id, fn] of callbacks) {
      watchListenerCallbacks[id] = fn;
    }
    return () => {
      for (const [id] of callbacks) {
        delete watchListenerCallbacks[id];
      }
    };
  }

  return () => {};
};

const startLockfileWatchListener = async () => {
  watchListenerExists = true;
  const watcher = Deno.watchFs(resolve(defaultPath), { recursive: false });
  for await (const op of watcher) {
    if (op.kind === "remove") {
      console.error(
        "game credentials lockfile was deleted and will be reloaded after update",
      );
      credentialsCache = null;
      continue;
    }

    const shouldIgnore =
      Date.now() - lastLockfileChange < lockfileWatchDebounceMs;
    lastLockfileChange = Date.now();
    if (shouldIgnore) continue;

    const credentials = await loadGameCredentials();
    if (!credentials.ok) {
      continue;
    }
    credentialsCache = credentials.data;
    console.error("game credentials have changed, cache was updated");
    for (const fn of Object.values(watchListenerCallbacks)) {
      fn();
    }
  }
};

const loadGameCredentials = (): Promise<Result<GameCredentials>> => {
  return tryCatch(async () => {
    const lockfile = await Deno.readTextFile(resolve(defaultPath));

    // name:pid:port:password:protocol
    const [_, __, gamePort, gamePassword, protocol] = lockfile.split(":");
    const gameEndpointUrl = `${protocol}://127.0.0.1:${gamePort}`;
    const gameWebsocketUrl = `wss://riot:${gamePassword}@127.0.0.1:${gamePort}`;

    return {
      ok: true,
      data: {
        http: {
          endpoint: gameEndpointUrl,
          authHeader: `Basic ${encode("riot:" + gamePassword)}`,
        },
        wss: {
          endpoint: gameWebsocketUrl,
        },
      },
    };
  }, "game credentials lockfile does not exist");
};

const getGameCredentials = async (): Promise<Result<GameCredentials>> => {
  if (!credentialsCache) {
    return await loadGameCredentials();
  }
  return { ok: true, data: credentialsCache };
};

export { getGameCredentials, onGameCredentialsUpdate };
