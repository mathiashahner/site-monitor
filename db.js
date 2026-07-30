import 'dotenv/config'
import mysql from 'mysql2/promise'

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } =
  process.env
const TABLE_NAME = 'results'

let pool

const ensureResultsTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      message VARCHAR(255) NOT NULL,
      value TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export const getMysqlPool = async () => {
  if (!pool) {
    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE) {
      throw new Error('MySQL environment variables are not configured')
    }

    pool = mysql.createPool({
      host: MYSQL_HOST,
      port: Number(MYSQL_PORT || 3306),
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return pool
}

export const getLatestScrapingResults = async () => {
  const connection = await getMysqlPool()

  await ensureResultsTable(connection)

  const [rows] = await connection.execute(`
    SELECT current.name, current.value
    FROM ${TABLE_NAME} current
    INNER JOIN (
      SELECT name, MAX(id) AS id
      FROM ${TABLE_NAME}
      GROUP BY name
    ) latest ON latest.id = current.id
  `)

  return rows
}

export const saveScrapingResults = async (results) => {
  const connection = await getMysqlPool()

  await ensureResultsTable(connection)

  await Promise.all(
    results.map(({ name, message, value }) =>
      connection.execute(
        `INSERT INTO ${TABLE_NAME} (name, message, value) VALUES (?, ?, ?)`,
        [name, message, value],
      ),
    ),
  )
}
