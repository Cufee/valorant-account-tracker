export type PlayerInfoResponse = {
  country: string;
  /** Player UUID */
  sub: string;
  email_verified: boolean;
  player_plocale?: unknown | null;
  /** Milliseconds since epoch */
  country_at: number | null;
  pw: {
    /** Milliseconds since epoch */
    cng_at: number;
    reset: boolean;
    must_reset: boolean;
  };
  phone_number_verified: boolean;
  account_verified: boolean;
  ppid?: unknown | null;
  federated_identity_providers: string[];
  player_locale: string | null;
  username: string;
  acct: {
    type: number;
    state: string;
    adm: boolean;
    game_name: string;
    tag_line: string;
    /** Milliseconds since epoch */
    created_at: number;
  };
  age: number;
  jti: string;
  affinity: {
    [x: string]: string;
  };
};

export type SeasonMMRInfo = {
  /** Season ID */
  SeasonID: string;
  NumberOfWins: number;
  NumberOfWinsWithPlacements: number;
  NumberOfGames: number;
  Rank: number;
  CapstoneWins: number;
  LeaderboardRank: number;
  CompetitiveTier: number;
  RankedRating: number;
  WinsByTier: {
    [x: string]: number;
  } | null;
  GamesNeededForRating: number;
  TotalWinsNeededForRank: number;
};

export type PlayerMMRResponse = {
  Version: number;
  /** Player UUID */
  Subject: string;
  NewPlayerExperienceFinished: boolean;
  QueueSkills: {
    [x: string]: {
      TotalGamesNeededForRating: number;
      TotalGamesNeededForLeaderboard: number;
      CurrentSeasonGamesNeededForRating: number;
      SeasonalInfoBySeasonID: {
        [x: string]: SeasonMMRInfo;
      };
    };
  };
  LatestCompetitiveUpdate: {
    /** Match ID */
    MatchID: string;
    /** Map ID */
    MapID: string;
    /** Season ID */
    SeasonID: string;
    MatchStartTime: number;
    TierAfterUpdate: number;
    TierBeforeUpdate: number;
    RankedRatingAfterUpdate: number;
    RankedRatingBeforeUpdate: number;
    RankedRatingEarned: number;
    RankedRatingPerformanceBonus: number;
    CompetitiveMovement: "MOVEMENT_UNKNOWN";
    AFKPenalty: number;
  };
  IsLeaderboardAnonymized: boolean;
  IsActRankBadgeHidden: boolean;
};

export type Season = {
  /** UUID */
  ID: string;
  Name: string;
  Type: "episode" | "act";
  /** Date in ISO 8601 format */
  StartTime: string;
  /** Date in ISO 8601 format */
  EndTime: string;
  IsActive: boolean;
};

export type Event = {
  /** UUID */
  ID: string;
  Name: string;
  /** Date in ISO 8601 format */
  StartTime: string;
  /** Date in ISO 8601 format */
  EndTime: string;
  IsActive: boolean;
};

export type FetchContentResponse = {
  DisabledIDs: unknown[];
  Seasons: Season[];
  Events: Event[];
};
