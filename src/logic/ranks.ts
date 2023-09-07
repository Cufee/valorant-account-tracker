import { PlayerMMRResponse, Season } from "../core/types/riot/remoteApi.d.ts";
import { orderSeasonsByDate, seasonsToEpisodes } from "./seasons.ts";

type PlayerRank = {
  season: {
    episodeId: string;
    episode: string;
    actId: string;
    act: string;
  };
  tier: number;
};

const getLastPlayerRank = (
  mmrData: PlayerMMRResponse,
  seasonsData: Season[],
): PlayerRank => {
  const sortedSeasons = orderSeasonsByDate(seasonsData).reverse();
  const episodes = seasonsToEpisodes(sortedSeasons);

  // If the latest season data exists, use it
  if (mmrData.LatestCompetitiveUpdate.RankedRatingEarned > 0) {
    const episode = episodes.find((e) =>
      e.actIds.includes(mmrData.LatestCompetitiveUpdate.SeasonID)
    );
    const act = episode?.acts.find((a) =>
      a.ID === mmrData.LatestCompetitiveUpdate.SeasonID
    );
    return {
      season: {
        episodeId: episode?.ID || "",
        episode: episode?.Name || "Unknown",
        actId: act?.ID || "",
        act: act?.Name || "Unknown",
      },
      tier: mmrData.LatestCompetitiveUpdate.RankedRatingEarned,
    };
  }

  for (const season of sortedSeasons) {
    const rankTier =
      mmrData.QueueSkills["competitive"].SeasonalInfoBySeasonID[season.ID]
        ?.Rank || 0;
    if (rankTier > 0) {
      const episode = episodes.find((e) => e.actIds.includes(season.ID));
      const act = episode?.acts.find((a) => a.ID === season.ID);
      return {
        season: {
          episodeId: episode?.ID || "",
          episode: episode?.Name || "Unknown",
          actId: mmrData.LatestCompetitiveUpdate.SeasonID,
          act: act?.Name || "Unknown",
        },
        tier: rankTier,
      };
    }
  }

  const currentEpisode = episodes[0];
  const currentAct = currentEpisode.acts[0];
  return {
    season: {
      episodeId: currentEpisode.ID || "",
      episode: currentEpisode.Name || "Unknown",
      actId: currentAct.ID || "",
      act: currentAct.Name || "Unknown",
    },
    tier: 0,
  };
};

export { getLastPlayerRank };
