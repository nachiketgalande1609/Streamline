const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");
const authRoutes = require("./routes/auth.routes");
const invRoutes = require("./routes/inv.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/orders.routes");
const warehouseRoutes = require("./routes/warehouse.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Streamline");

app.use("/api", authRoutes);
app.use("/api/inventory", invRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(3001, () => {
    "Server Started";
});
