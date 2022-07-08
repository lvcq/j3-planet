import { Router } from "./deps.ts";
import { create_new_blog } from "./handlers/blog.ts";

const apis = new Router()
  .get("/blog/:id", /* get blog detail */ (ctx) => {
  })
  .post("/blog", /* create new blog */ async (ctx) => {
    await create_new_blog(ctx);
  })
  .put("/blog/:id", /* update blog info */ (ctx) => {
  });

const routers = new Router()
  .get("/", (ctx) => ctx.response.body = "Hello zly")
  .use("/api", apis.routes(), apis.allowedMethods());

export default routers;
