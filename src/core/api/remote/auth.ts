import { PlayerInfoResponse } from "../../types/riot/remoteApi.d.ts";
import sendApiRequest from "./request.ts";
import { RemoteCredentials } from "./types.d.ts";

const getPlayerInfo = (
  credentials: RemoteCredentials,
): Promise<PlayerInfoResponse> => {
  return sendApiRequest(
    "https://auth.riotgames.com/userinfo",
    credentials,
  );
};

export { getPlayerInfo };
