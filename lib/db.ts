import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cafeito_db",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

export async function query(sql: string, values?: any[]) {
  try {
    const connection = await pool.getConnection()
    try {
      const [results] = await connection.execute(sql, values || [])
      return results
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

export async function testConnection() {
  try {
    await query("SELECT 1")
    console.log("[v0] Database connection successful")
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return false
  }
}

export default pool

