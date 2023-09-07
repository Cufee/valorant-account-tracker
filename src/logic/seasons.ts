import { Season } from "../core/types/riot/remoteApi.d.ts";

const orderSeasonsByDate = (seasons: Season[]): Season[] => {
  return seasons.sort((a, b) =>
    new Date(b.StartTime) < new Date(a.StartTime) ? 1 : 0
  );
};

type Episode = Season & {
  acts: (Season & { Type: "act" })[];
  actIds: string[];
  Type: "episode";
};

const seasonsToEpisodes = (seasons: Season[]): Episode[] => {
  const episodeActs: Record<string, Season[]> = { "standalone": [] };
  const episodes: Season[] = [];

  let lastEpisode = "standalone";
  for (const season of seasons) {
    if (season.Type === "episode") {
      lastEpisode = season.ID;
      episodeActs[lastEpisode] = [];
      episodes.push(season);
    }
    if (season.Type === "act") {
      episodeActs[lastEpisode].push({ ...season, Type: "act" });
    }
  }

  const parsedEpisodes = episodes.map((episodeSeason) => ({
    ...episodeSeason,
    actIds: episodeActs[episodeSeason.ID].map((a) => a.ID),
    acts: episodeActs[episodeSeason.ID],
    Type: "episode",
  })) as Episode[];

  return parsedEpisodes;
};

export { orderSeasonsByDate, seasonsToEpisodes };
