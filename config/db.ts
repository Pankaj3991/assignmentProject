import mysql, { Connection } from "mysql2/promise";

declare global {
  var connection: Connection | undefined;
}

export async function getDB(): Promise<Connection> {
  if (!global.connection) {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "3306"),
    });

    // Select the database immediately
    await conn.query(`USE \`${process.env.DB_NAME}\``);

    global.connection = conn;
  }

  return global.connection;
}
