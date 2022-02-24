import { connection } from "../database/database.js"

export async function getCategories(req, res) {
  try {
    const { rows } = await connection.query('SELECT * FROM categories')

    res.send(rows).status(200)
  } catch {
    res.sendStatus(500)
  }
}

export async function postCategory(req, res) {
  const { name } = req.body

  try {
    await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [name])

    res.sendStatus(201)
  } catch {
    res.sendStatus(500)
  }
}