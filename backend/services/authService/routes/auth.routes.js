import express from 'express'
import { GoogleAuthController, LogoutController } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post("/login", GoogleAuthController)
authRouter.get("/logout", LogoutController)

export default authRouter

