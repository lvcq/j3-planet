import { serve } from "./deps.ts";

export function start_server() {
  serve((_req) => {
    return new Response("Hello World!", {
      headers: { "content-type": "text/plain" },
    });
  });
}
