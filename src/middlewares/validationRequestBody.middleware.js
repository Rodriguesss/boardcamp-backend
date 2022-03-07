import { connection } from "../database/database.js"

export const validateIfEntityExists = (entity, param) => {
	return async (req, res, next) => {
		let text = `SELECT * FROM ${entity} WHERE ${param} = $1 `
		let values = [req.body[param]]

		if (Object.keys(req.params).length > 0) {
			const { id } = req.params

			text += `AND id != $2`
			values = [req.body[param], parseInt(id)]
		}

		const { rowCount } = await connection.query({ text, values })

		rowCount === 0 ? next() : res.sendStatus(409)
	}
}

export const checkEntityExists = (entity) => {
	return async (req, res, next) => {
		const { rowCount } = await connection.query(`SELECT * FROM ${entity} WHERE id = $1`, [req.body.categoryId])

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
			res.sendStatus(500)
		}
	}
}

export function checkIfBirthdayDateIsValid(req, res, next) {
	try {
		let { birthday } = req.body

		let yearNow = new Date().getFullYear()
		let yearBirthdate = parseInt(birthday.split('-')[0])

		if (yearNow - yearBirthdate >= 150) {
			return res.sendStatus(400)
		}

		next()
	} catch {
		res.sendStatus(400)
	}
}

