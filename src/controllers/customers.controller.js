import { connection } from "../database/database.js"

export async function getCustomers(req, res) {
  try {
    const { cpf } = req.query
    let rows = []

    if (cpf) {
      ({ rows } = await connection.query(`SELECT * FROM customers WHERE LOWER(cpf) LIKE LOWER($1);`, [cpf + "%"]))
    } else {
      ({ rows } = await connection.query(`SELECT * FROM customers;`))
    }

    res.send(rows).status(200)
  } catch {
    res.sendStatus(500)
  }
}

export async function getCustomer(req, res) {
  try {
    const { id } = req.params

    const { rows } = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id])

    if (rows.length === 0) {
      return res.sendStatus(404)
    }

    res.send(rows).status(200)
  } catch {
    res.sendStatus(500)
  }
}

export async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body

  try {
    await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday])

    res.sendStatus(201)
  } catch {
    res.sendStatus(500)
  }
}

export async function putCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body
  const { id } = req.params
  
  try {
    await connection.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4
    WHERE id = $5`, [name, phone, cpf, birthday, id])

    res.sendStatus(201)
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}