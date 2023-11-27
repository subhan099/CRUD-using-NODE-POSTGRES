//to run backend file , use "nodemon"

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./queries");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    info: "Node.js Express & Postgres CRUD REST API",
  });
});

app.get("/users", db.getUsers);
app.post("/users", db.createUser);
app.delete(`/users/:user_id`, db.deleteUser);
app.put(`/users/:user_id`, db.updateUser);
app.listen(PORT, () => {
  console.log("App is running on PORT 5000");
});
