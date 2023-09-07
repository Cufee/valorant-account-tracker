import { join } from "https://deno.land/std@0.201.0/path/join.ts";
import { getGameCredentials } from "./credentials.ts";

const sendGameRequest = async (path: string) => {
  const { http } = getGameCredentials();

  const response = await fetch(join(http.endpoint, path), {
    headers: {
      "Authorization": http.authHeader,
    },
  });

  return response.json();
};

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

const sendHelpRequest = async (): Promise<LocalHelpResponse> => {
  return await sendGameRequest("/help");
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

const getAccessTokens = async (): Promise<EntitlementsTokenResponse> => {
  return await sendGameRequest("/entitlements/v1/token");
};

type ClientRegionResponse = {
  locale: string;
  region: string;
  webLanguage: string;
  webRegion: string;
};

const getClientRegion = async (): Promise<
  ClientRegionResponse
> => {
  return await sendGameRequest("/riotclient/region-locale");
};

export { getAccessTokens, getClientRegion, sendGameRequest, sendHelpRequest };
