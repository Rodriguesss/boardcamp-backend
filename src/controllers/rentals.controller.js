import { connection } from "../database/database.js"

export async function getRentals(req, res) {
  try {
    const { customerId } = req.query
    let rows = []

    if (customerId) {
      //({ rows } = await connection.query(`SELECT * FROM rentals WHERE LOWER(cpf) LIKE LOWER($1);`, [cpf + "%"]))
    } else {
      ({ rows } = await connection.query(`SELECT * FROM rentals;`))
    }

    res.send(rows).status(200)
  } catch {
    res.sendStatus(500)
  }
}
