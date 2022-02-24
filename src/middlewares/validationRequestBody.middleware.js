import { connection } from "../database/database.js"

export const validateIfEntityExists = (entity, param) => {
  return async (req, res, next) => {
    const { rowCount } = await connection.query(`SELECT * FROM ${entity} WHERE ${param} = ''||$1||''`, [req.body[param]]);

    rowCount === 0 ? next() : res.sendStatus(409)
  }
}

export const checkEntityExists = (entity) => {
  return async (req, res, next) => {
    const { rowCount} = await connection.query(`SELECT * FROM ${entity} WHERE id = $1`, [req.body.categoryId])

    rowCount === 0 ? res.sendStatus(400) : next()
  }
}

export const validationSchema = (schema) => {
	return async (req, res, next) => {
		try {
			const validation = schema.validate(req.body)
			
			if (validation.error) {
				return res.sendStatus(400);
			}

			next()
		} catch {
			next()
		}
	}
}