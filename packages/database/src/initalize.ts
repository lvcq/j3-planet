// 初始化数据库，创建表等

import { initialize as blog_initialize } from "./models/blog.ts";
import { initalize as category_initialize } from './models/category.ts';

export async function initialize() {
  console.log("begin initialize database ......");
  await category_initialize();
  await blog_initialize();
  console.log("Database initialize success.");
}
