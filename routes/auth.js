import express from "express";
import { registerUser } from "../controller/auth/register.js";

const authRoute = express.Router();

authRoute.post("/register", registerUser);

export default authRoute;
