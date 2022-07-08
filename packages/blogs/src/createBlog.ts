import { db_create_blog, NewBlog, insert_blog } from './deps.ts';


export async function create_blog(info: NewBlog) {
  const new_blog = db_create_blog(info);
  await insert_blog(new_blog);
  return new_blog.id;
}







