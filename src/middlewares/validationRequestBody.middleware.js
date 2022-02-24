import { connection } from "../database/database.js"

export function checkFieldIsFilled(req, res, next) {
  let error = false

  Object.keys(req.body).forEach(param => {
    req.body[param] === "" && (error = true)
  })

  error ? res.sendStatus(400) : next()
}

export const validateIfEntityExists = (entity, param) => {
  return async (req, res, next) => {
    const { rowCount } = await connection.query(`SELECT * FROM ${entity} WHERE ${param} = '${req.body[param]}'`)
    console.log(rowCount)

    rowCount === 0 ? next() : res.sendStatus(409)
  }
}

export function checksIfParameterGreaterThanZero(req, res, next) {
  let { stockTotal, pricePerDay } = req.body
  let error = false

  Object.keys({ stockTotal, pricePerDay }).forEach(param => {
    param < 0 && (error = true)
  })

  error ? res.sendStatus(400) : next()
}

export const checkEntityExists = (entity) => {
  return async (req, res, next) => {
    const { rowCount} = await connection.query(`SELECT * FROM ${entity} WHERE id = $1`,[req.body.categoryId])

    rowCount === 0 ? res.sendStatus(400) : next()
  }
}