import { getCompetitiveTiers } from "../core/api/external/compTiers.ts";
import { getCurrentVersions } from "../core/api/external/version.ts";
import { getAccessTokens } from "../core/api/game/game.ts";
import { getGameSessionInfo } from "../core/api/game/session.ts";
import { getPlayerInfo } from "../core/api/remote/auth.ts";
import { getGameContent, getPlayerMMR } from "../core/api/remote/pvp.ts";
import {
  RemoteCredentials,
  RemoteRequestOptions,
} from "../core/api/remote/types.d.ts";
import { getLastPlayerRank } from "./ranks.ts";
import Database from "../core/database/local.ts";
import { Account } from "../core/types/account.d.ts";

const saveCurrentAccountInfo = async () => {
  const tokens = await getAccessTokens();
  if (!tokens.ok) {
    console.error("failed to get auth token:", tokens.message);
    return;
  }

  const credentials: RemoteCredentials = {
    token: tokens.data.accessToken,
    entitlement: tokens.data.token,
  };

  const db = Database.connect();
  const player = await getPlayerInfo(credentials);
  if (!player.ok) {
    console.error("failed to get current account information:", player.message);
    return;
  }

  const gameInfo = await getGameSessionInfo();
  if (!gameInfo.ok) {
    console.error("failed to get a game session:", gameInfo.message);
    return;
  }
  const versions = await getCurrentVersions();
  if (!versions.ok) {
    console.error("failed to get available game versions:", versions.message);
    return;
  }
  const remoteOptions: RemoteRequestOptions = {
    clientPlatform: gameInfo.data.platform,
    clientVersion: versions.data.riotClientVersion,
    region: gameInfo.data.region,
    shard: gameInfo.data.shard,
  };

  const playerMMR = await getPlayerMMR(
    player.data.sub,
    credentials,
    remoteOptions,
  );
  if (!playerMMR.ok) {
    console.error("failed to get current player MMR:", playerMMR.message);
    return;
  }

  const content = await getGameContent(credentials, remoteOptions);
  if (!content.ok) {
    console.error("failed to get current game content:", content.message);
    return;
  }
  const lastRank = getLastPlayerRank(playerMMR.data, content.data.Seasons);

  const compTiers = await getCompetitiveTiers();
  if (!compTiers.ok) {
    console.error("failed to get ranks list:", compTiers.message);
    return;
  }
  const compTierList = compTiers.data.pop();

  const lastRankDetails = compTierList?.tiers.find((t) =>
    t.tier === lastRank.tier
  );
  const accountInfo: Account = {
    id: player.data.sub,
    username: player.data.username,
    name: player.data.acct.game_name,
    tag: player.data.acct.tag_line,
    lastRank: {
      tier: lastRank.tier,
      name: lastRankDetails?.tierName || "Unknown",
      color: lastRankDetails?.color || "",
      icon: lastRankDetails?.largeIcon || "",
    },
  };
  await db.set("accounts", accountInfo.id, accountInfo);

  console.debug(
    "local account was updated:",
    await db.get("accounts", accountInfo.id),
  );
};

export { saveCurrentAccountInfo };
