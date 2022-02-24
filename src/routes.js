import { Router } from "express"
import { getCategories, postCategories } from "./controllers/categories.controller.js"
import { getGames, postGames } from "./controllers/games.controller.js"
import { checkFieldIsFilled, checksIfParameterGreaterThanZero, checkEntityExists, validateIfEntityExists } from "./middlewares/validationRequestBody.middleware.js"

const router = Router()

router.get('/categories', getCategories)
router.post('/categories', [checkFieldIsFilled, validateIfEntityExists('categories', 'name')], postCategories)

router.get('/games', getGames)
router.post('/games', [checkFieldIsFilled, checksIfParameterGreaterThanZero, validateIfEntityExists('games', 'name'), checkEntityExists('categories')], postGames)

export { router }