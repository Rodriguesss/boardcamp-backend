import joi from 'joi'

const CustomersSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11).required(),
  cpf: joi.string().min(11).max(11).required(),
  birthday: joi.string().required()
})

export { CustomersSchema }