import express from "express";
import { signUp, login, logOut } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", login);
authRouter.get("/logout", logOut);

export default authRouter;   // ✅ ab sahi export ho raha hai
