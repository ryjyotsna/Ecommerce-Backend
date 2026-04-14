import express from "express";
import { addToCart } from "../controller/cart/addToCart.js";
import { getCart } from "../controller/cart/getCart.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);

export default router;