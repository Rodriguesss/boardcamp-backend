import { Router } from "express"
import { getCategories, postCategory } from "./controllers/categories.controller.js"
import { getCustomer, getCustomers, postCustomer, putCustomer } from "./controllers/customers.controller.js"
import { getGames, postGame } from "./controllers/games.controller.js"
import { getRentals } from "./controllers/rentals.controller.js"
import { checkEntityExists, validateIfEntityExists, validationSchema } from "./middlewares/validationRequestBody.middleware.js"
import { CategoriesSchema } from "./schemas/categories.schema.js"
import { CustomersSchema } from "./schemas/customers.schema.js"
import { GamesSchema } from "./schemas/games.schema.js"

const router = Router()

router.get('/categories', getCategories)
router.post('/categories', [validationSchema(CategoriesSchema), validateIfEntityExists('categories', 'name')], postCategory)

router.get('/games', getGames)
router.post('/games', [validationSchema(GamesSchema), validateIfEntityExists('games', 'name'),
  checkEntityExists('categories')], postGame)

router.get('/customers', getCustomers)
router.get('/customers/:id', getCustomer)
router.post('/customers', [validationSchema(CustomersSchema), validateIfEntityExists('customers', 'cpf')], postCustomer)
router.put('/customers/:id', [validationSchema(CustomersSchema), validateIfEntityExists('customers', 'cpf')], putCustomer)

router.get('/rentals', getRentals)

export { router }