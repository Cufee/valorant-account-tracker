import { encode } from "https://deno.land/std@0.194.0/encoding/base64.ts";
import { getClientRegion, sendGameRequest } from "./game.ts";

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

const sendSessionsRequest = async (): Promise<SessionsResponse> => {
  return await sendGameRequest("/product-session/v1/external-sessions");
};

type ClientInfo = {
  platform: string;
  version: string;
  region: string;
  shard: string;
};

const getGameSessionInfo = async (): Promise<ClientInfo> => {
  const region = await getClientRegion();

  // Find the first session that is not Riot Client
  const sessions = await sendSessionsRequest();
  const gameSession = Object.entries(sessions).find(([name, _]) =>
    name !== "host_app"
  )?.[1];
  if (!gameSession) {
    console.log("no game session found");
    Deno.exit(1);
  }

  const endpointConfig = gameSession.launchConfiguration.arguments.find((
    a,
  ) => a.includes("-config-endpoint="));
  if (!endpointConfig) {
    console.log("no endpoint");
    Deno.exit(1);
  }
  // https://shared.na.a.pvp.net
  const [_, shard] = endpointConfig.replace("-config-endpoint=", "").split(
    ".",
    4,
  );
  return {
    platform: clientPlatformEncoded,
    version: gameSession.version,
    region: region.region,
    shard,
  };
};

export { clientPlatformEncoded, getGameSessionInfo, sendSessionsRequest };
