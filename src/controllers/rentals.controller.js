import { connection } from "../database/database.js"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

export async function getRentals(req, res) {
  try {
    const { customerId, gameId } = req.query
    let rows = []

    if (customerId) {
      ({ rows } = await connection.query(`SELECT rentals.*, games.*, customers.* FROM rentals 
      JOIN games ON "gameId" = games.id 
      JOIN customers ON "customerId" = customers.id WHERE customers.id = $1`, [customerId]) )
    } else if (gameId) {
      ({ rows } = await connection.query(`SELECT rentals.*, games.*, customers.* FROM rentals 
      JOIN games ON "gameId" = games.id 
      JOIN customers ON "customerId" = customers.id WHERE games.id = $1`, [gameId]) )
    } else {
      ({ rows } = await connection.query(`SELECT rentals.*, games.*, customers.* FROM rentals 
      JOIN games ON "gameId" = games.id 
      JOIN customers ON "customerId" = customers.id`))
    }

    res.send(rows).status(200)
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body

  try {
    if (daysRented <= 0) {
      return res.sendStatus(400)
    }

    const { rows: customersRows } = await connection.query(`SELECT * FROM customers WHERE id = $1`, [customerId])

    if (customersRows === 0) {
      return res.sendStatus(400)
    }

    const { rows: gamesRows } = await connection.query(`SELECT * FROM games WHERE id = $1`, [gameId])

    if (gamesRows.length === 0) {
      return res.sendStatus(400)
    }

    let originalPrice = daysRented * gamesRows[0].pricePerDay

    await connection.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
    VALUES ($1, $2, $3, $4, $5, null, null)`,
      [customerId, gameId, daysRented, dayjs().tz("America/Sao_Paulo").utc().local().format(), originalPrice])

    res.sendStatus(201)
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function finishRentals(req, res) {
  try {
    const { rows } = await connection.query(`SELECT rentals.*, games.*, customers.* FROM rentals 
    JOIN games ON "gameId" = games.id 
    JOIN customers ON "customerId" = customers.id WHERE rentals.id = $1`, [parseInt(req.params.id)])

    if (rows.length === 0) {
      return res.sendStatus(404)
    }

    const { rows: rentals } = await connection.query(`SELECT rentals.*, games.*, customers.* FROM rentals 
    JOIN games ON "gameId" = games.id 
    JOIN customers ON "customerId" = customers.id WHERE rentals.id = $1 AND "returnDate" IS NOT NULL`, [parseInt(req.params.id)])

    if (rentals.length > 0) {
      return res.sendStatus(400)
    }
    
    let dateNow = dayjs().tz("America/Sao_Paulo").utc().local().format().split('-')
    let dayNow = parseInt(dateNow[2].substring(0,2))
    let monthNow = parseInt(dateNow[1])
    let yearNow = parseInt(dateNow[0])

    const rentDateDay = rows[0].rentDate.getDate()
    const rentDateMonth = rows[0].rentDate.getMonth() + 1
    const rentDateYear = rows[0].rentDate.getFullYear()

    const resultDay = dayNow - rentDateDay
    const resultMonth = monthNow - rentDateMonth
    const resultYear = yearNow - rentDateYear

    let lateRentDays = 0

    if(resultDay > 0) {
      lateRentDays += resultDay
    }

    if(resultMonth > 0) {
      lateRentDays += resultMonth * 30
    }

    if(resultYear > 0) {
      lateRentDays += resultYear * 365
    }

    let delayFee = 0
    lateRentDays !== 0 && (delayFee = rows[0].pricePerDay * lateRentDays)

    await connection.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2
    WHERE id = $3`, [dayjs().tz("America/Sao_Paulo").utc().local().format(), delayFee, parseInt(req.params.id)])

    res.sendStatus(200)
  } catch(error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function deleteRentals(req, res) {
  const id = parseInt(req.params.id)

  const { rows } = await connection.query(`SELECT rentals.*, games.*, customers.* FROM rentals 
    JOIN games ON "gameId" = games.id 
    JOIN customers ON "customerId" = customers.id WHERE rentals.id = $1`, [id])

    console.log(rows)

    if (rows.length === 0) {
      return res.sendStatus(404)
    }

    const { rows: rentals } = await connection.query(`SELECT rentals.*, games.*, customers.* FROM rentals 
    JOIN games ON "gameId" = games.id 
    JOIN customers ON "customerId" = customers.id WHERE rentals.id = $1 AND "returnDate" IS NOT NULL`, [id])

    if (rentals.length > 0) {
      return res.sendStatus(400)
    }

    await connection.query(`DELETE FROM rentals WHERE id = $1`, [id])

    res.sendStatus(200)
}
