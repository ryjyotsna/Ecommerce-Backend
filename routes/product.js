import express from "express";
import { createProduct } from "../controller/product/createProduct.js";
import { getProducts } from "../controller/product/getProducts.js";
import { getProductById } from "../controller/product/getProductById.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;