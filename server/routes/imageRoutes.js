import express from 'express'
import { generateimage } from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

imageRouter.post('/generate-image',userAuth,generateimage)

export default imageRouter;
