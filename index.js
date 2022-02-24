import express from 'express'
import cors from 'cors'

import 'dotenv/config'

import { router } from './src/routes.js';

const PORT = process.env.PORT || 4000;

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})