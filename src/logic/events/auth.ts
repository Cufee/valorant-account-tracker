import { onGameCredentialsUpdate } from "../../core/api/game/credentials.ts";
import { newSocketConnection } from "../../core/api/game/socket.ts";
import Database from "../../core/database/local.ts";

const valorantAuthEventUri = "/rso-auth/v2/authorizations/valorant-client";

const db = Database.connect();
const authEventCallbacks: Record<string, () => Promise<void>> = {};
let authQueueListenerActive = false;

const registerAuthQueueListener = () => {
  authQueueListenerActive = true;

  db.listenQueue("valorantAuth", () => {
    for (const fn of Object.values(authEventCallbacks)) {
      fn();
    }
  });

  registerAuthSocketEvents();
  return onGameCredentialsUpdate([
    `internal_${valorantAuthEventUri}`,
    registerAuthSocketEvents,
  ]);
};

const registerAuthSocketEvents = () => {
  newSocketConnection(
    ["OnJsonApiEvent_rso-auth_v2_authorizations"],
    async () => {
      await db.enqueue("valorantAuth", null);
    },
  );
};

const onValorantAccountChange = (
  ...callbacks: [string, () => Promise<void>][]
) => {
  if (!authQueueListenerActive) registerAuthQueueListener();

  for (const [id, fn] of callbacks) {
    authEventCallbacks[id] = fn;
  }

  return () => {
    for (const [id] of callbacks) {
      delete authEventCallbacks[id];
    }
  };
};

export { onValorantAccountChange };
