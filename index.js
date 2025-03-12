const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const expressListRoutes = require("express-list-routes");
// const employee=require("./routes/employees")
const users = require("./routes/users");
const cards = require("./routes/cards");
// const products=require("./routes/products")
// const carts=require("./routes/carts")
// const login=require("./routes/login")
// const profile=require("./routes/profile")
const auth = require("./middlewares/auth");
const logger = require("./middlewares/logger");
const port = process.env.PORT || 5000;

const app = express();

mongoose
  .connect(process.env.DB)
  .then(() => console.log("👍connected to mongo db server⭐"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/users", users);
app.use("/cards", cards);

expressListRoutes(app);

app.listen(port, () => console.log(`👍port started ${port}⭐`));
