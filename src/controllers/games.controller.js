import { connection } from "../database/database.js"

export async function getGames(req, res) {
  try {
    const { name } = req.query;
    let rows = []

    Object.keys(req.query).length > 0
      ? { rows } = await connection.query(`SELECT * FROM games WHERE name LIKE '$1%';`, [name])
      : { rows } = await connection.query(`SELECT * FROM games;`)

    res.send(rows).status(200)
  } catch {
    res.sendStatus(500)
  }
}

export async function postGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body
  console.log(req.body)

  try {
    await connection.query(`INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay) 
    VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay])

    res.sendStatus(201)
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}