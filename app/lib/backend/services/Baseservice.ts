import { ResultSetHeader } from "mysql2";
import db from "../db/db";
import { QueryOptions } from "../../types/QueryOptions";
export class BaseService<T> {
  constructor(private table: string) {}
  async getAll(): Promise<T[]> {
    const [rows] = (await db.query(
      `SELECT * FROM ${this.table}`
    )) as unknown as [T[]];
    return rows;
  }

  async getById(id: number): Promise<T | null> {
    const [rows] = (await db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [
      id,
    ])) as unknown as [T[]];
    return rows.length ? rows[0] : null;
  }

  async create(data: Partial<T>): Promise<number> {
    const [result] = await db.execute(
      `INSERT INTO ${this.table} (${Object.keys(data).join(
        ","
      )}) VALUES (${Object.keys(data)
        .map(() => "?")
        .join(",")})`,
      Object.values(data)
    );
    return (result as any).insertId;
  }

  async update(id: number, data: Partial<T>): Promise<boolean> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const [result] = await db.execute(
      `UPDATE ${this.table} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return (result as any).affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await db.execute(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return (result as any).affectedRows > 0;
  }

  async findCustom(options: QueryOptions): Promise<T[]> {
    const {
      where = {},
      orWhere = {},
      orderBy,
      orderDir = "ASC",
      limit,
      offset,
      joins = "",
      select = "*",
    } = options;

    let query = `SELECT ${select} FROM ${this.table} ${
      joins ? joins : ""
    } WHERE 1=1`;
    const values: any[] = [];

    if (Object.keys(where).length > 0) {
      const orConditions: string[] = [];

      for (const [key, val] of Object.entries(where)) {
        if (typeof val === "string" && val.startsWith("LIKE ")) {
          orConditions.push(`${key} ${val}`);
        } else {
          orConditions.push(`${key} = ?`);
          values.push(val);
        }
      }

      if (orConditions.length > 0) {
        query += ` AND (${orConditions.join(" OR ")})`;
      }
    }
    if (Object.keys(orWhere).length > 0) {
      const orConditions: string[] = [];

      for (const [key, val] of Object.entries(orWhere)) {
        if (typeof val === "string" && val.startsWith("LIKE ")) {
          orConditions.push(`${key} ${val}`);
        } else {
          orConditions.push(`${key} = ?`);
          values.push(val);
        }
      }

      if (orConditions.length > 0) {
        query += ` AND (${orConditions.join(" OR ")})`;
      }
    }

    if (orderBy) query += ` ORDER BY ${orderBy} ${orderDir}`;
    if (limit) query += ` LIMIT ${limit}`;
    if (offset) query += ` OFFSET ${offset}`;

    const [rows] = (await db.query(query, values)) as unknown as [T[], any];
    return rows;
  }
}


