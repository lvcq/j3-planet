import { Application } from "./deps.ts";
import routers from "./routers.ts";

export async function start_server() {
  const app = new Application();
  app.use(routers.routes());
  app.use(routers.allowedMethods());

  const port = get_port();
  console.log(`http server start listening: ${port}`);

  await app.listen({
    port
  });
}

function get_port(): number {
  try {
    const env_port = Deno.env.get("ZLY_PORT");
    if (!env_port) {
      return 80;
    }
    return Number(env_port);
  } catch {
    return 80;
  }
}
