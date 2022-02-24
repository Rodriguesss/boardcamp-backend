import joi from 'joi'

const CategoriesSchema = joi.object({
  name: joi.string().required()
})

export { CategoriesSchema } 