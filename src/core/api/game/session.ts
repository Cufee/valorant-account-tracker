import { encode } from "https://deno.land/std@0.194.0/encoding/base64.ts";

import { Result } from "../../types/result.d.ts";
import sendRequest from "./client.ts";
import { getClientRegion } from "./game.ts";

const clientPlatform = {
  "platformType": "PC",
  "platformOS": "Windows",
  "platformOSVersion": "10.0.19042.1.256.64bit",
  "platformChipset": "Unknown",
};

const clientPlatformEncoded = encode(JSON.stringify(clientPlatform));

type SessionsResponse = {
  [x: string]: {
    exitCode: number;
    exitReason: null;
    isInternal: boolean;
    launchConfiguration: {
      arguments: string[];
      executable: string;
      locale: string | null;
      voiceLocale: null;
      workingDirectory: string;
    };
    patchlineFullName: "VALORANT" | "riot_client";
    patchlineId: "" | "live" | "pbe";
    phase: string;
    productId: "valorant" | "riot_client";
    version: string;
  };
};

const sendSessionsRequest = async (): Promise<Result<SessionsResponse>> => {
  return await sendRequest("/product-session/v1/external-sessions");
};

type ClientInfo = {
  platform: string;
  version: string;
  region: string;
  shard: string;
};

const getGameSessionInfo = async (): Promise<Result<ClientInfo>> => {
  const region = await getClientRegion();
  if (!region.ok) return region;

  // Find the first session that is not Riot Client
  const sessions = await sendSessionsRequest();
  if (!sessions.ok) return sessions;

  const gameSession = Object.entries(sessions.data).find(([name, _]) =>
    name !== "host_app"
  )?.[1];
  if (!gameSession?.launchConfiguration) {
    return {
      ok: false,
      message: "no game session found",
    };
  }

  const endpointConfig = gameSession.launchConfiguration.arguments.find((
    a,
  ) => a.includes("-config-endpoint="));
  if (!endpointConfig) {
    return {
      ok: false,
      message: "game session has no endpoint",
    };
  }
  // https://shared.na.a.pvp.net
  const [_, shard] = endpointConfig.replace("-config-endpoint=", "").split(
    ".",
    4,
  );
  return {
    ok: true,
    data: {
      platform: clientPlatformEncoded,
      version: gameSession.version,
      region: region.data.region,
      shard,
    },
  };
};

export { clientPlatformEncoded, getGameSessionInfo, sendSessionsRequest };
