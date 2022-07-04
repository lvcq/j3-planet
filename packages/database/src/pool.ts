import { Pool, PoolClient } from "./deps.ts";

type PoolWaiter = (_: Pool) => void;

let pool: Pool | null = null;

const waiters: Array<PoolWaiter> = [];

export function initiallzeDatabasePool(count = 5) {
  const database_url = Deno.env.get("DATABASE_URL");
  if (!database_url) {
    throw Error("please set environment variable `DATABASE_URL`.");
  }
  pool = new Pool(database_url, count, true);
  if (pool !== null) {
    waiters.forEach(w => w(pool as Pool))
  } else {
    throw Error("connect to database fail")
  }
}

export async function getConnection() {
  if (pool) {
    return await pool.connect();
  } else {
    return new Promise<PoolClient>((resolve) => {
      waiters.push((pool: Pool) => resolve(pool.connect()));
    })
  }
}

export async function close() {
  if (pool) {
    await pool.end();
  }
}
