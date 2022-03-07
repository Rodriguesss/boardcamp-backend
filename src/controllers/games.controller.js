import { connection } from "../database/database.js"

export async function getGames(req, res) {
  try {
    const { name } = req.query
    console.log(req.query)
    let rows = []

    if (name) {
      ({ rows } = await connection.query(`SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1);`, [name+"%"]))
    } else {
      ({ rows } = await connection.query(`SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id`))
    }

    res.send(rows).status(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function postGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body

  try {
    await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
    VALUES ($1, $2, $3, $4, $5)`, [name, image, parseInt(stockTotal), categoryId, parseInt(pricePerDay)])

    res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}