require("dns").setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const contactRoutes = require("./routes/contactRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Maa Bird Foundation Backend is Running!");
});

app.use("/api/reports", reportRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/contacts", contactRoutes);
connectDB();

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});