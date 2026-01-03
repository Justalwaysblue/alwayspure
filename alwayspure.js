import { loadSettings, initSettings } from "./settings.js";
import { initChat } from "./chat.js";

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  initSettings();
  initChat();
});
