import joi from 'joi'

const GamesSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  categoryId: joi.number().min(1).required(),
  stockTotal: joi.number().min(1).required(),
  pricePerDay: joi.number().min(1).required()
})

export { GamesSchema } 