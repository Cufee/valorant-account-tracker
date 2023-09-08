import { Result } from "../../types/result.d.ts";
import { PlayerInfoResponse } from "../../types/riot/remoteApi.d.ts";
import sendApiRequest from "./client.ts";
import { RemoteCredentials } from "./types.d.ts";

const getPlayerInfo = (
  credentials: RemoteCredentials,
): Promise<Result<PlayerInfoResponse>> => {
  return sendApiRequest(
    "https://auth.riotgames.com/userinfo",
    credentials,
  );
};

export { getPlayerInfo };
