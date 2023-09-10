import { onValorantAccountChange } from "./logic/events/auth.ts";
import startWebserver from "./server/serve.ts";
import { saveCurrentAccountInfo } from "./logic/accounts.ts";

// Register account update listener
onValorantAccountChange(["saveCurrentAccountInfo", saveCurrentAccountInfo]);
// Update current account
saveCurrentAccountInfo();

// Start a UI web server
startWebserver();
