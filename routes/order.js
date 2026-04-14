import express from "express";
import { placeOrder } from "../controller/order/placeOrder.js";

const router = express.Router();

router.post("/place", placeOrder);

export default router;