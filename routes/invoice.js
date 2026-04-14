import express from "express";
import { generateInvoice } from "../controller/invoice/generateInvoice.js";

const router = express.Router();

router.post("/generate", generateInvoice);

export default router;