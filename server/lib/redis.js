import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const client = createClient({
  url: process.env.UPSTACH_REDIS_URL,
});

client.on("error", function (err) {
  throw err;
});

await client.connect();
