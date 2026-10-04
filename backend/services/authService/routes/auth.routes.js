import express from "express";
import {
  GoogleAuthController,
  LogoutController,
  useCredits,
  addCredits,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", GoogleAuthController);
authRouter.get("/logout", LogoutController);
authRouter.post("/usecredits", useCredits);
authRouter.post("/addcredits", addCredits);

export default authRouter;
