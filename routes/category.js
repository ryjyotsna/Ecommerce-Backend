import express from "express";
import { createCategory } from "../controller/category/createCategory.js";
import { getCategories } from "../controller/category/getCategories.js";

const router = express.Router();

// Routes
router.post("/", createCategory);
router.get("/", getCategories);

export default router;