const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const connectDB = require("./connection");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

connectDB();
app.listen(port, () => console.log(`API started on port ${port}`));

app.use("/users", require("./controllers/users"));
