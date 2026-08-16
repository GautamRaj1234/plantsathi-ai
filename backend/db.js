import { JSONFilePreset } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, "data", "db.json");

const defaultData = {
  users: [],
  plants: [],       // saved plants in "My Garden"
  diagnoses: [],     // history of disease diagnoses
  chats: []          // chat history with AI Plant Doctor
};

export const db = await JSONFilePreset(dbFile, defaultData);
