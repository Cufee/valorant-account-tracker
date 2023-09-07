interface Episode {
  uuid: string;
  assetObjectName: string;
  tiers: Tier[];
  assetPath: string;
}

interface Tier {
  tier: number;
  tierName: string;
  division: string;
  divisionName: string;
  color: string;
  backgroundColor: string;
  smallIcon?: string;
  largeIcon?: string;
  rankTriangleDownIcon?: string;
  rankTriangleUpIcon?: string;
}

const getCompetitiveTiers = async (): Promise<Episode[]> => {
  const response = await fetch("https://valorant-api.com/v1/competitivetiers");
  const raw = await response.json();
  return Object.values(raw.data);
};

export { getCompetitiveTiers };
