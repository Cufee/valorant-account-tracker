import { getGameCredentials } from "./credentials.ts";
// Default WebSocket implementation does not support blank messages in some cases
// from looking into this, seems like there is a check on message length when an event type is error
import Socket from "npm:ws";

type GameEvent<T> = {
  data: T;
  eventType: string;
  uri: string;
};

type ValorantData<T> = [number, string, GameEvent<T>];

const newSocketConnection = async (
  events: string[],
  callback?: (name: string, data: unknown) => void,
) => {
  const credentials = await getGameCredentials();
  if (!credentials.ok) return credentials;

  const connection: WebSocket = new Socket(credentials.data.wss.endpoint);
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
      if (callback) callback(eventName, payload);
    } catch (error) {
      console.error("failed to parse event:", error, event.data);
    }
  };

  return () => connection.close();
};

export { newSocketConnection };
