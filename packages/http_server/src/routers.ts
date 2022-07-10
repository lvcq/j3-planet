import { Router } from "./deps.ts";
import { create_new_blog, get_blog_detail } from "./handlers/blog.ts";
import { create_new_category } from "./handlers/category.ts";

const apis = new Router()
  .get("/blog/:id", /* get blog detail */ get_blog_detail)
  .post("/blog", /* create new blog */ async (ctx) => {
    await create_new_blog(ctx);
  })
  .put("/blog/:id", /* update blog info */ (ctx) => {
  })
  .post("/category", async (ctx) => {
    await create_new_category(ctx);
  });

const routers = new Router()
  .get("/", (ctx) => ctx.response.body = "Hello zly")
  .use("/api", apis.routes(), apis.allowedMethods());

export default routers;
