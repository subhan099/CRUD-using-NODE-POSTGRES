const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "1234",
  host: "localhost",
  port: 5433,
  database: "CRUD",
});

const getUsers = (req, res) => {
  pool.query("SELECT * FROM CRUD ORDER BY user_id ASC ", (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

const createUser = (req, res) => {
  console.log(req.body);
  const { name, title } = req.body;
  const user_id = 1;
  pool.query(
    "INSERT INTO crud (name, title) VALUES($1, $2 ) RETURNING *",
    [name, title],
    (err, results) => {
      if (err) {
        throw err;
      }
      //   console.log("hitting create api,", res);
      res.status(201).send(`user added with ID: ${results.rows[0].user_id}`);
    }
  );
};

const updateUser = (req, res) => {
  console.log(req.params);
  const { name, title } = req.body;
  console.log(name, title);

  // Create an array for the parameters
  const params = [];

  // Create the SET clause dynamically based on provided fields
  let setClause = "";
  if (name) {
    setClause += `name = $${params.length + 1}, `;
    params.push(name);
  }
  if (title) {
    setClause += `title = $${params.length + 1} `;
    params.push(title);
  }

  console.log(setClause, "setclause");
  // ("UPDATE crud SET name=$1 title=$2 Where user_id = $3");
  if (title) {
    pool.query(
      `UPDATE crud SET ${setClause} WHERE user_id = $${params.length + 1}`,
      params.concat([req.params.user_id]),
      (err, result) => {
        if (err) {
          throw err;
        }
        res.status(200).send("Updated correctly");
      }
    );
  } else {
    res.status(200).send("Invalid Data");
    console.log("Invalid Data");
  }
};

const deleteUser = (req, res) => {
  console.log(req.params);

  pool.query(
    `DELETE FROM crud WHERE user_id = $1`,
    [req.params.user_id],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.rowCount === 0) {
        res
          .status(404)
          .send(`User with ID ${req.params.user_id} does not exist`);
      } else {
        res
          .status(200)
          .send(`Successfully deleted user with ID: ${req.params.user_id}`);
      }
    }
  );
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};
