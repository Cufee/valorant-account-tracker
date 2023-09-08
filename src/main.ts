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

import { onValorantAccountChange } from "./logic/events/auth.ts";

const loadCurrentAccountInfo = async () => {
  const tokens = await getAccessTokens();
  if (!tokens.ok) {
    console.error(tokens.message);
    return;
  }

  const credentials: RemoteCredentials = {
    token: tokens.data.accessToken,
    entitlement: tokens.data.token,
  };

  const db = Database.connect();
  const player = await getPlayerInfo(credentials);
  if (!player.ok) {
    console.error(player.message);
    return;
  }

  const gameInfo = await getGameSessionInfo();
  if (!gameInfo.ok) {
    console.error(gameInfo.message);
    return;
  }
  const versions = await getCurrentVersions();
  if (!versions.ok) {
    console.error(versions.message);
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
    console.error(playerMMR.message);
    return;
  }

  const content = await getGameContent(credentials, remoteOptions);
  if (!content.ok) {
    console.error(content.message);
    return;
  }
  const lastRank = getLastPlayerRank(playerMMR.data, content.data.Seasons);

  const compTiers = await getCompetitiveTiers();
  if (!compTiers.ok) {
    console.error(compTiers.message);
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
  const ok = await db.set("accounts", accountInfo.id, accountInfo);
  console.debug(ok);

  console.debug(await db.get("accounts", accountInfo.id));
};

onValorantAccountChange(["test", loadCurrentAccountInfo]);

console.error("Started tracking local accounts");

loadCurrentAccountInfo();
