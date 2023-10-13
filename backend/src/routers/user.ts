import express from "express";
import * as userController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/",requiresAuth, userController.getAuthenticatedUser); //check si user est authentifié avant l'appel du handler

router.post("/signup", userController.signUp);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

export default router;