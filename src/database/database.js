import pkg from 'pg'

const { Pool } = pkg

const connection = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DATABASE
})

export { connection }