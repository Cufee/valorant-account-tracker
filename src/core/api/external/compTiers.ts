import { Result } from "../../types/result.d.ts";
import { tryCatch } from "../../utils/tryCatch.ts";

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

const getCompetitiveTiers = (): Promise<Result<Episode[]>> => {
  return tryCatch(async () => {
    const response = await fetch(
      "https://valorant-api.com/v1/competitivetiers",
    );
    const raw = await response.json();
    return {
      ok: true,
      data: Object.values(raw.data),
    };
  }, "failed to get competitive tiers from remote api");
};

export { getCompetitiveTiers };
