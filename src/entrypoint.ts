import { db_initialize, initiallzeDatabasePool, start_server } from "./deps.ts";

export async function start() {
  initiallzeDatabasePool();
  await db_initialize();
  await start_server();
}
