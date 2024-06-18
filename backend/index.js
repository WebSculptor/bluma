require("dotenv").config();
const express = require("express");
const connectDB = require("./database/firebaseAdmin");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));