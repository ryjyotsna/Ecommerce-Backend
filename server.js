import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
import categoryRoute from "./routes/category.js";
import productRoute from "./routes/product.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";
import invoiceRoute from "./routes/invoice.js";



dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT;
connectDB();
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("API is healthy");
});

//Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/invoice", invoiceRoute);

app.listen(PORT, () => {
  console.log(`Server is running`);
});
