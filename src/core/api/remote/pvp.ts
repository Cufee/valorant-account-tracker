import { Result } from "../../types/result.d.ts";
import {
  FetchContentResponse,
  PlayerMMRResponse,
} from "../../types/riot/remoteApi.d.ts";
import sendApiRequest from "./client.ts";
import { RemoteCredentials, RemoteRequestOptions } from "./types.d.ts";

const getPlayerMMR = (
  puuid: string,
  credentials: RemoteCredentials,
  opts: RemoteRequestOptions,
): Promise<Result<PlayerMMRResponse>> => {
  const url = `https://pd.${opts.shard}.a.pvp.net/mmr/v1/players/${puuid}`;
  return sendApiRequest(url, credentials, opts);
};

const getGameContent = (
  credentials: RemoteCredentials,
  opts: RemoteRequestOptions,
): Promise<Result<FetchContentResponse>> => {
  const url =
    `https://shared.${opts.shard}.a.pvp.net/content-service/v3/content`;
  return sendApiRequest(url, credentials, opts);
};

export { getGameContent, getPlayerMMR };
