import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";

import { Account } from "../core/types/account.d.ts";
import Database from "../core/database/local.ts";

const eta = new Eta({ views: "./static" });
const db = Database.connect();

const handler = async (req: Request) => {
  const accounts = await db.list<Account>("accounts");

  // POST requests are made from a refresh button, we don't need to return the full layout - just the app
  if (req.method === "POST") {
    return new Response(eta.render("app", { accounts }), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return new Response(eta.render("index", { accounts }), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};

export default () =>
  Deno.serve({
    port: 6942,
    onListen: ({ port }) => console.error(`Listening on port ${port}`),
  }, handler);
