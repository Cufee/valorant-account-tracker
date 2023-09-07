import { getGameCredentials } from "./credentials.ts";
// Default WebSocket implementation does not support blank messages in some cases
// from looking into this, seems like there is a check on message length when an event type is error
import Socket from "npm:ws";

const events = [
  //   "OnClientFlash",
  //   "OnClientFocus",
  //   "OnClientMinimize",
  "OnJsonApiEvent_agent_v1_requests",
  "OnJsonApiEvent_agent_v1_session",
  //   "OnJsonApiEvent_chat_v4_friends",
  //   "OnJsonApiEvent_chat_v4_presences",
  //   "OnJsonApiEvent_chat_v5_messages",
  //   "OnJsonApiEvent_chat_v6_conversations",
  //   "OnJsonApiEvent_chat_v6_friendrequests",
  "OnJsonApiEvent_player-account_aliases_v1",
  "OnJsonApiEvent_riot-messaging-service_v1_session",
  "OnJsonApiEvent_riot-messaging-service_v1_state",
  "OnJsonApiEvent_riot-messaging-service_v1_user",
];

type ValorantData<T> = [number, string, Record<string, T>];

const newSocketConnection = (
  callback?: (name: string, data: unknown) => void,
) => {
  const { wss } = getGameCredentials();

  const connection: WebSocket = new Socket(wss.endpoint);
  connection.onopen = () => {
    console.log("WSS connection open");

    events.forEach((event) => {
      connection.send(JSON.stringify([5, event]));
    });
  };
  connection.onclose = (event) => {
    console.log("WSS connection closed", JSON.stringify(event));
  };
  connection.onerror = (event) => {
    console.error("error:", JSON.stringify(event));
  };

  connection.onmessage = (event) => {
    if (!event.data) return;
    try {
      const [_, eventName, payload] = JSON.parse(event.data) as ValorantData<
        unknown
      >;
      console.log(eventName, payload);

      Deno.writeTextFileSync(
        "log.txt",
        "\n" + JSON.stringify({ [eventName]: payload }, null, 2),
        { append: true },
      );

      if (callback) callback(eventName, payload);
    } catch (error) {
      console.error("failed to parse event:", error, event.data);
    }
  };
};

export { newSocketConnection };
