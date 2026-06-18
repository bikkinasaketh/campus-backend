import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");

const app = express();

connectDB(); // await తీసేయండి

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
// app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("CampusFix Backend Running");
});

export default app;
