/**
 * File-backed in-memory database for local development.
 * Mimics the Supabase client query chain API so all existing
 * supabase-server.ts calls work without any real Supabase project.
 *
 * Only used when USE_MOCK_DB=true in .env.local
 */

import fs from "fs";
import path from "path";
import { SEED_PRODUCTS } from "./mock-data";

const DATA_DIR = path.join(process.cwd(), "dev-data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readProducts(): Record<string, unknown>[] {
  ensureDir();
  if (fs.existsSync(PRODUCTS_FILE)) {
    const stored = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8")) as Record<string, unknown>[];
    if (stored.length > 0) return stored;
  }
  const data = SEED_PRODUCTS as unknown as Record<string, unknown>[];
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
  return data;
}

function readOrders(): Record<string, unknown>[] {
  ensureDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, "[]");
    return [];
  }
  return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
}

function writeProducts(data: Record<string, unknown>[]) {
  ensureDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
}

function writeOrders(data: Record<string, unknown>[]) {
  ensureDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));
}

type Row = Record<string, unknown>;
type FilterFn = (row: Row) => boolean;

class QueryResult<T> {
  data: T | null;
  error: null;
  count: number | null;
  constructor(data: T | null, count?: number) {
    this.data = data;
    this.error = null;
    this.count = count ?? null;
  }
}

class SelectBuilder {
  private tableName: string;
  private filters: FilterFn[] = [];
  private _order?: { field: string; asc: boolean };
  private _limit?: number;
  private _isSingle = false;
  private _countOnly = false;
  private _headOnly = false;

  constructor(table: string) {
    this.tableName = table;
  }

  select(_fields: string, opts?: { count?: string; head?: boolean }) {
    if (opts?.head) this._headOnly = true;
    if (opts?.count) this._countOnly = true;
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push((row) => row[field] === value);
    return this;
  }

  neq(field: string, value: unknown) {
    this.filters.push((row) => row[field] !== value);
    return this;
  }

  gt(field: string, value: unknown) {
    this.filters.push((row) => Number(row[field]) > Number(value));
    return this;
  }

  lte(field: string, value: unknown) {
    this.filters.push((row) => Number(row[field]) <= Number(value));
    return this;
  }

  order(field: string, opts?: { ascending?: boolean }) {
    this._order = { field, asc: opts?.ascending ?? true };
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  single() {
    this._isSingle = true;
    return this;
  }

  private getTable(): Row[] {
    if (this.tableName === "products") return readProducts();
    if (this.tableName === "orders") return readOrders();
    return [];
  }

  then(resolve: (result: QueryResult<Row | Row[] | null>) => void) {
    let rows = this.getTable();
    for (const f of this.filters) rows = rows.filter(f);

    if (this._order) {
      const { field, asc } = this._order;
      rows = rows.sort((a, b) => {
        const av = String(a[field] ?? "");
        const bv = String(b[field] ?? "");
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    if (this._countOnly || this._headOnly) {
      resolve(new QueryResult(null, rows.length) as QueryResult<null>);
      return;
    }

    if (this._limit) rows = rows.slice(0, this._limit);

    if (this._isSingle) {
      resolve(
        new QueryResult(rows[0] ?? null) as QueryResult<Row | null>
      );
    } else {
      resolve(new QueryResult(rows) as QueryResult<Row[]>);
    }
  }
}

class InsertBuilder {
  private tableName: string;
  private rows: Row[];
  private _isSingle = false;

  constructor(table: string, rows: Row | Row[]) {
    this.tableName = table;
    this.rows = Array.isArray(rows) ? rows : [rows];
  }

  select() {
    return this;
  }

  single() {
    this._isSingle = true;
    return this;
  }

  then(resolve: (result: QueryResult<Row | Row[] | null>) => void) {
    const now = new Date().toISOString();
    const newRows = this.rows.map((r) => ({
      ...r,
      id: r.id ?? crypto.randomUUID(),
      created_at: r.created_at ?? now,
      updated_at: r.updated_at ?? now,
    }));

    if (this.tableName === "products") {
      const existing = readProducts();
      writeProducts([...existing, ...newRows]);
    } else if (this.tableName === "orders") {
      const existing = readOrders();
      writeOrders([...existing, ...newRows]);
    }

    if (this._isSingle) {
      resolve(new QueryResult(newRows[0] ?? null) as QueryResult<Row | null>);
    } else {
      resolve(new QueryResult(newRows) as QueryResult<Row[]>);
    }
  }
}

class UpdateBuilder {
  private tableName: string;
  private updates: Row;
  private filters: FilterFn[] = [];

  constructor(table: string, updates: Row) {
    this.tableName = table;
    this.updates = updates;
  }

  eq(field: string, value: unknown) {
    this.filters.push((row) => row[field] === value);
    return this;
  }

  select() {
    return this;
  }

  single() {
    return this;
  }

  then(resolve: (result: QueryResult<Row | null>) => void) {
    const now = new Date().toISOString();
    let updated: Row | null = null;

    if (this.tableName === "products") {
      const rows = readProducts().map((r) => {
        if (this.filters.every((f) => f(r))) {
          updated = { ...r, ...this.updates, updated_at: now };
          return updated;
        }
        return r;
      });
      writeProducts(rows);
    } else if (this.tableName === "orders") {
      const rows = readOrders().map((r) => {
        if (this.filters.every((f) => f(r))) {
          updated = { ...r, ...this.updates, updated_at: now };
          return updated;
        }
        return r;
      });
      writeOrders(rows);
    }

    resolve(new QueryResult(updated));
  }
}

class DeleteBuilder {
  private tableName: string;
  private filters: FilterFn[] = [];

  constructor(table: string) {
    this.tableName = table;
  }

  eq(field: string, value: unknown) {
    this.filters.push((row) => row[field] === value);
    return this;
  }

  then(resolve: (result: QueryResult<null>) => void) {
    if (this.tableName === "products") {
      const rows = readProducts().filter(
        (r) => !this.filters.every((f) => f(r))
      );
      writeProducts(rows);
    } else if (this.tableName === "orders") {
      const rows = readOrders().filter(
        (r) => !this.filters.every((f) => f(r))
      );
      writeOrders(rows);
    }
    resolve(new QueryResult(null));
  }
}

class MockSupabaseTable {
  constructor(private tableName: string) {}

  select(fields = "*", opts?: { count?: string; head?: boolean }) {
    const b = new SelectBuilder(this.tableName);
    return b.select(fields, opts);
  }

  insert(row: Row | Row[]) {
    return new InsertBuilder(this.tableName, row);
  }

  update(updates: Row) {
    return new UpdateBuilder(this.tableName, updates);
  }

  delete() {
    return new DeleteBuilder(this.tableName);
  }
}

export class MockSupabaseClient {
  from(table: string) {
    return new MockSupabaseTable(table);
  }

  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: unknown) => {
        // In dev mode, storage uploads are no-ops
        console.log(`[MockDB] Storage upload skipped: ${bucket}/${path}`);
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => ({
        data: {
          publicUrl: `https://placehold.co/800x800/1E1E20/C9943A?text=${encodeURIComponent(path.split("/").pop() ?? "Image")}`,
        },
      }),
      remove: async (paths: string[]) => {
        console.log(`[MockDB] Storage remove skipped:`, paths);
        return { data: null, error: null };
      },
    }),
  };

  auth = {
    signInWithPassword: async (credentials: {
      email: string;
      password: string;
    }) => {
      if (
        credentials.email === process.env.ADMIN_EMAIL &&
        credentials.password === process.env.ADMIN_PASSWORD
      ) {
        return {
          data: {
            user: { id: "admin-dev", email: credentials.email },
            session: { access_token: "dev-token" },
          },
          error: null,
        };
      }
      return {
        data: { user: null, session: null },
        error: { message: "Invalid credentials" },
      };
    },
    signOut: async () => ({ error: null }),
    getUser: async () => ({
      data: { user: null },
      error: null,
    }),
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
  };
}

export function createMockClient() {
  return new MockSupabaseClient();
}
