import { create_category as db_create_category, insert_category, NewCategory } from "@database";


export async function create_category(cate: NewCategory) {
  const new_cate = db_create_category(cate);
  await insert_category(new_cate);
  return new_cate.id;
}