// 初始化数据库，创建表等

import { initialize as blogInitialize } from "./models/blog.ts";

export async function initialize() {
  console.log("begin initialize database ......");
  await blogInitialize();
  console.log("Database initialize success.");
}
