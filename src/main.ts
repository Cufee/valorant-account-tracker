import { getCompetitiveTiers } from "./core/api/external/compTiers.ts";
import { getCurrentVersions } from "./core/api/external/version.ts";
import { getAccessTokens } from "./core/api/game/game.ts";
import { getGameSessionInfo } from "./core/api/game/session.ts";
import { getPlayerInfo } from "./core/api/remote/auth.ts";
import { getGameContent, getPlayerMMR } from "./core/api/remote/pvp.ts";
import {
  RemoteCredentials,
  RemoteRequestOptions,
} from "./core/api/remote/types.d.ts";
import { getLastPlayerRank } from "./logic/ranks.ts";
import Database from "./core/database/local.ts";
import { Account } from "./core/types/account.d.ts";

const tokens = await getAccessTokens();
const credentials: RemoteCredentials = {
  token: tokens.accessToken,
  entitlement: tokens.token,
};

const db = Database.connect();
const player = await getPlayerInfo(credentials);

const gameInfo = await getGameSessionInfo();
const versions = await getCurrentVersions();
const remoteOptions: RemoteRequestOptions = {
  clientPlatform: gameInfo.platform,
  clientVersion: versions.riotClientVersion,
  region: gameInfo.region,
  shard: gameInfo.shard,
};

const playerData = await getPlayerMMR(player.sub, credentials, remoteOptions);

const content = await getGameContent(credentials, remoteOptions);
const lastRank = getLastPlayerRank(playerData, content.Seasons);

const compTiers = await getCompetitiveTiers();
const compTierList = compTiers.pop();

const lastRankDetails = compTierList?.tiers.find((t) =>
  t.tier === lastRank.tier
);
const accountInfo: Account = {
  id: player.sub,
  username: player.username,
  name: player.acct.game_name,
  tag: player.acct.tag_line,
  lastRank: {
    tier: lastRank.tier,
    name: lastRankDetails?.tierName || "Unknown",
    color: lastRankDetails?.color || "",
    icon: lastRankDetails?.largeIcon || "",
  },
};
const ok = await db.set("accounts", accountInfo.id, accountInfo);
console.log(ok);

console.log(await db.get("accounts", accountInfo.id));
