import mysql from "mysql2/promise";

let pool:any;

if (!global._mysqlPool) {
  global._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });
}

pool = global._mysqlPool;

export default pool;
