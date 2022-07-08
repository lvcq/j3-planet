import { getConnection } from '../pool.ts';

export async function initalize() {
  const conn = await getConnection();
  try {
    await conn.queryObject`CREATE TABLE IF NOT EXISTS category(
        id UUID PRIMARY KEY,
        name VARCHAR(64) NOT NULL UNIQUE,
        create_by UUID NOT NULL,
        create_at TIMESTAMP NOT NULL DEFAULT now(),
        update_at TIMESTAMP NOT NULL DEFAULT now()
      );
      ALTER TABLE category ENABLE ROW LEVEL SECURITY;
      COMMENT ON TABLE category IS 'blog 分类'; 
      CREATE OR REPLACE FUNCTION update_datetime() RETURNS TRIGGER AS $$
        begin 
          new.update_at = current_timestamp;
          return new;
        end;
      $$language plpgsql;
      DROP TRIGGER IF EXISTS category_trigger ON category;
      create or REPLACE trigger category_trigger before update on category for each row execute procedure update_datetime();
    `
  } finally {
    conn.release();
  }

}

export interface Category {
  id: string;
  name: string;
  create_by: string;
  create_at?: number;
  update_at?: number;
}

export type NewCategory = Omit<Category, 'id' | 'create_at' | 'update_at'>;

export function create_category(category: NewCategory): Category {
  const new_id = globalThis.crypto.randomUUID();
  return {
    id: new_id,
    ...category
  }
}

export async function insert_category(cate: Category) {
  const conn = await getConnection();
  try {
    const is_exists = !!(await get_category_by_name(cate.name));
    if (is_exists) {
      throw Error(`分类${cate.name}已存在`);
    } else {
      await conn.queryArray`INSERT INTO category (id,name,create_by) VALUES (${cate.id},${cate.name},${cate.create_by})`;
    }
  } catch (e) {
    console.error("Insert category error: ", e);
    throw Error("创建分类失败")
  } finally {
    conn.release();
  }
}


export async function get_category_by_name(name: string) {
  const conn = await getConnection();
  try {
    const result = await conn.queryObject<Category>`select id,name,create_by,create_at,update_at from category where name=${name};`;
    if (result.rowCount === 1) {
      return result.rows
    } else {
      return null
    }
  } catch (e) {
    console.error("Search category fail: ", e);
    throw e;
  }
}
