// types/QueryOptions.ts
export type QueryOptions = {
  where?: Record<string, any>; // Simple key-value pairs
  orWhere?: Record<string, any>; // Optional OR clause
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  joins?: string; // raw SQL join string, optional
  select?: string; // raw select fields, defaults to '*'
};
