import { getConnection } from "../pool.ts";
import { Marked } from "../deps.ts";

const TABLE_NAME = "blog";

export async function initialize() {
  const conn = await getConnection();
  try {
    // Create the table
    await conn.queryObject(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
    id UUID primary key,
    title VARCHAR(64) NOT NULL,
    summary VARCHAR(256) NOT NULL,
    category_id UUID NOT NULL,
    tags VARCHAR(128),
    conent TEXT NOT NULL,
    html TEXT NOT NULL,
    create_by UUID NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT now(),
    update_at TIMESTAMP NOT NULL DEFAULT now()
);
  comment on column ${TABLE_NAME}.id is '${TABLE_NAME} id';
  comment on column ${TABLE_NAME}.title is '${TABLE_NAME} title';
  comment on column ${TABLE_NAME}.summary is '${TABLE_NAME} summary';

  create or REPLACE function update_datetime() returns trigger as $$
    begin 
      new.update_at = current_timestamp;
      return new;
    end;
  $$language plpgsql;
  DROP TRIGGER IF EXISTS ${TABLE_NAME}_trigger on ${TABLE_NAME};
  create or REPLACE trigger ${TABLE_NAME}_trigger before update on ${TABLE_NAME} for each row execute procedure update_datetime();
    `);
  } finally {
    // Release the connection back into the pool
    conn.release();
  }
}

export interface Blog {
  id: string;
  title: string;
  summary: string;
  category_id: string;
  tags?: string;
  content: string;
  html: string;
  create_by: string;
  create_at?: number;
  update_at?: number;
}

export type NewBlog = Omit<Blog, "id" | "html" | "create_at" | "update_at">;

export function create_blog({
  title,
  summary,
  category_id,
  tags,
  content,
  create_by,
}: NewBlog): Blog {
  const new_id = globalThis.crypto.randomUUID();

  return {
    id: new_id,
    title,
    summary,
    category_id,
    tags,
    content,
    html: parseMdToHtml(content),
    create_by,
  };
}

function parseMdToHtml(md: string) {
  const markup = Marked.parse(md);
  return markup.content;
}

export async function insert_blog(blog: Blog) {
  const conn = await getConnection();
  const stmt =
    `INSERT INTO ${TABLE_NAME} (id,title,summary,category_id,tags,content,html,create_by) VALUES (${blog.id},${blog.title},${blog.summary},${blog.category_id},${
      blog.tags || null
    },${blog.content},${blog.html},${blog.create_by})`;
  try {
    conn.queryArray(stmt);
  } catch {
    console.log(`execute sql fail: ${stmt}`);
    throw Error("insert blog error");
  } finally {
    conn.release();
  }
}
