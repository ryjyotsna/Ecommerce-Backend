import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
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

app.listen(PORT, () => {
  console.log(`Server is running`);
});
