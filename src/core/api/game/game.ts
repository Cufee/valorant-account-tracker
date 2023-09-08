import { Result } from "../../types/result.d.ts";
import sendRequest from "./client.ts";

type LocalHelpResponse = {
  events: {
    [x: string]: string;
  };
  functions: {
    [x: string]: string;
  };
  types: {
    [x: string]: string;
  };
};

const sendHelpRequest = async (): Promise<Result<LocalHelpResponse>> => {
  return await sendRequest("/help");
};

type EntitlementsTokenResponse = {
  /** Used as the token in requests */
  accessToken: string;
  entitlements: unknown[];
  issuer: string;
  /** Player UUID */
  subject: string;
  /** Used as the entitlement in requests */
  token: string;
};

const getAccessTokens = async (): Promise<
  Result<EntitlementsTokenResponse>
> => {
  return await sendRequest("/entitlements/v1/token");
};

type ClientRegionResponse = {
  locale: string;
  region: string;
  webLanguage: string;
  webRegion: string;
};

const getClientRegion = async (): Promise<
  Result<ClientRegionResponse>
> => {
  return await sendRequest("/riotclient/region-locale");
};

export { getAccessTokens, getClientRegion, sendHelpRequest };
