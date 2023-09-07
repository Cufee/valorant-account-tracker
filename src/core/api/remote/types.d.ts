type RemoteCredentials = {
  entitlement?: string;
  token: string;
};

type RemoteRequestOptions = {
  clientPlatform: string;
  clientVersion: string;
  region: string;
  shard: string;
};

export { RemoteCredentials, RemoteRequestOptions };
