import { getConnection } from "../pool.ts";

const TABLE_NAME = "blog";

export async function initialize() {
  const conn = await getConnection();
  try {
    // Create the table
    await conn.queryObject`CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
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
  create trigger ${TABLE_NAME}_trigger before update on ${TABLE_NAME} for each row execute procedure update_datetime();
    `;
  } finally {
    // Release the connection back into the pool
    conn.release();
  }
}
