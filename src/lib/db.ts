import getClient from "./turso";
import type { InValue } from "@libsql/client";

let schemaReady = false;

async function ensureSchemaOnce() {
  if (schemaReady) return;
  await ensureSchema();
  schemaReady = true;
}

export async function ensureSchema() {
  await getClient().executeMultiple(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      photo TEXT NOT NULL DEFAULT '',
      "order" INTEGER NOT NULL DEFAULT 0,
      socialLinks TEXT NOT NULL DEFAULT '{}',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      client TEXT NOT NULL DEFAULT '',
      year TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      details TEXT NOT NULL DEFAULT '[]',
      images TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '',
      features TEXT NOT NULL DEFAULT '[]',
      "order" INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      featuredImage TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      category TEXT NOT NULL DEFAULT '',
      views INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      service TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      "read" INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      siteLogo TEXT NOT NULL DEFAULT '',
      siteTitle TEXT NOT NULL DEFAULT '',
      tagline TEXT NOT NULL DEFAULT '',
      footerText TEXT NOT NULL DEFAULT '',
      socialLinks TEXT NOT NULL DEFAULT '{}',
      contactInfo TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientName TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL DEFAULT 5,
      review TEXT NOT NULL DEFAULT '',
      photo TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function toInValue(v: unknown): InValue {
  if (v === null || v === undefined) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "object") return JSON.stringify(v);
  return v as InValue;
}

function parseJSON(val: unknown, fallback: unknown) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val;
}

function rowToDoc(row: Record<string, unknown>) {
  const doc: Record<string, unknown> = { ...row };
  for (const key of ["socialLinks", "contactInfo", "tags", "details", "images", "features"]) {
    if (key in doc) doc[key] = parseJSON(doc[key], key === "features" || key === "details" || key === "images" || key === "tags" ? [] : {});
  }
  if ("featured" in doc) doc.featured = Boolean(doc.featured);
  if ("read" in doc) doc.read = Boolean(doc.read);
  return doc;
}

export async function findAll(
  table: string,
  filter?: Record<string, unknown>,
  sort?: Record<string, 1 | -1>,
  limit?: number
) {
  await ensureSchemaOnce();
  let sql = `SELECT * FROM ${table}`;
  const args: InValue[] = [];
  const conditions: string[] = [];

  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null) {
        const col = key === "order" ? `"order"` : key;
        conditions.push(`${col} = ?`);
        args.push(toInValue(value));
      }
    }
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  if (sort) {
    const [col, dir] = Object.entries(sort)[0];
    const sortCol = col === "order" ? `"order"` : col;
    sql += ` ORDER BY ${sortCol} ${dir === 1 ? "ASC" : "DESC"}`;
  }

  if (limit) {
    sql += ` LIMIT ?`;
    args.push(limit);
  }

  const result = await getClient().execute({ sql, args });
  return result.rows.map(rowToDoc);
}

export async function findOne(table: string, filter?: Record<string, unknown>) {
  const results = await findAll(table, filter, undefined, 1);
  return results[0] || null;
}

export async function findById(table: string, id: string | number) {
  await ensureSchemaOnce();
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const result = await getClient().execute({
    sql: `SELECT * FROM ${table} WHERE id = ?`,
    args: [numId],
  });
  return result.rows[0] ? rowToDoc(result.rows[0]) : null;
}

export async function createOne(table: string, data: Record<string, unknown>) {
  await ensureSchemaOnce();
  const entries = Object.entries(data).filter(([k]) => k !== "id");
  const columns = entries.map(([k]) => k === "order" ? '"order"' : `"${k}"`).join(", ");
  const placeholders = entries.map(() => "?").join(", ");
  const values: InValue[] = entries.map(([_, v]) => toInValue(v));

  const result = await getClient().execute({
    sql: `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
    args: values,
  });

  return { id: Number(result.lastInsertRowid), ...data };
}

export async function updateById(table: string, id: string | number, data: Record<string, unknown>) {
  await ensureSchemaOnce();
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const entries = Object.entries(data).filter(([k]) => k !== "id");
  const setClauses = entries.map(([k]) => {
    const col = k === "order" ? '"order"' : `"${k}"`;
    return `${col} = ?`;
  }).join(", ");
  const values: InValue[] = entries.map(([_, v]) => toInValue(v));

  await getClient().execute({
    sql: `UPDATE ${table} SET ${setClauses} WHERE id = ?`,
    args: [...values, numId],
  });
}

export async function deleteById(table: string, id: string | number) {
  await ensureSchemaOnce();
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  await getClient().execute({
    sql: `DELETE FROM ${table} WHERE id = ?`,
    args: [numId],
  });
}

export async function deleteAll(table: string, filter?: Record<string, unknown>) {
  await ensureSchemaOnce();
  if (filter && Object.keys(filter).length > 0) {
    const conditions: string[] = [];
    const args: InValue[] = [];
    for (const [key, value] of Object.entries(filter)) {
      conditions.push(`${key} = ?`);
      args.push(toInValue(value));
    }
    await getClient().execute({
      sql: `DELETE FROM ${table} WHERE ${conditions.join(" AND ")}`,
      args,
    });
  } else {
    await getClient().execute(`DELETE FROM ${table}`);
  }
}

export async function insertMany(table: string, docs: Record<string, unknown>[]) {
  await ensureSchemaOnce();
  for (const doc of docs) {
    await createOne(table, doc);
  }
}
