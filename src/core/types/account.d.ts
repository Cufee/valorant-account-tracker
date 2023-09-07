export type Account = {
  id: string;
  name: string;
  username: string;
  tag: string;
  lastRank: {
    tier: number;
    name: string;
    color: string;
    icon: string;
  };
};
