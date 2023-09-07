type Versions = {
  manifestId: string;
  branch: string;
  version: string;
  buildVersion: string;
  engineVersion: string;
  riotClientVersion: string;
  riotClientBuild: string;
  buildDate: string;
};

const getCurrentVersions = async (): Promise<Versions> => {
  const response = await fetch("https://valorant-api.com/v1/version");
  const raw = await response.json();
  return raw.data;
};

export { getCurrentVersions };
