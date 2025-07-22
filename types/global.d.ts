declare global {
  // for globalThis
  var _mysqlPool: import("mysql2/promise").Pool | undefined;
}

export {};