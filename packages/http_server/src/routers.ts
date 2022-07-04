import { Router } from "./deps.ts";

const apis = new Router()
  .get("/blog/:id", /* get blog detail */ (ctx) => {
  })
  .post("/blog", /* create new blog */ (ctx) => {
  })
  .put("/blog/:id", /* update blog info */ (ctx) => {
  });

const routers = new Router()
  .use("/api",apis.routes(),apis.allowedMethods());

export default routers;
