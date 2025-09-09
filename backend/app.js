const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

let db = null;
const dbPath = path.join(__dirname, "todoApplication.db");

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create table todosLists with AUTOINCREMENT id
    await db.exec(`
      CREATE TABLE IF NOT EXISTS todosLists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT NOT NULL,
        priority TEXT CHECK(priority IN ('HIGH','MEDIUM','LOW')),
        status TEXT CHECK(status IN ('TO DO','IN PROGRESS','DONE'))
      );
    `);

    app.listen(4000, () => {
      console.log("Server is running on port 4000...");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBandServer();

// GET all todos
app.get("/todos/", async (req, res) => {
  const { search_q, status, priority } = req.query;
  let query = "SELECT * FROM todosLists";
  const conditions = [];
  const parameters = [];

  if (search_q) {
    conditions.push("todo LIKE ?");
    parameters.push(`%${search_q}%`);
  }

  if (status) {
    conditions.push("status = ?");
    parameters.push(status);
  }

  if (priority) {
    conditions.push("priority = ?");
    parameters.push(priority);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const result = await db.all(query, parameters);
  res.send(result);
});

// GET single todo
app.get("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const query = `SELECT * FROM todosLists WHERE id = ?;`;
  const result = await db.get(query, todoId);
  res.send(result);
});

// POST add new todo
app.post("/todos/", async (req, res) => {
  const { todo, priority, status } = req.body;
  const query = `INSERT INTO todosLists (todo, priority, status) VALUES (?, ?, ?);`;
  await db.run(query, [todo, priority, status]);
  res.send("Todo Successfully Added");
});

// PUT update todo
app.put("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const { status, priority, todo } = req.body;

  if (status !== undefined) {
    await db.run(`UPDATE todosLists SET status = ? WHERE id = ?;`, [
      status,
      todoId,
    ]);
    res.send("Status Updated");
  } else if (priority !== undefined) {
    await db.run(`UPDATE todosLists SET priority = ? WHERE id = ?;`, [
      priority,
      todoId,
    ]);
    res.send("Priority Updated");
  } else if (todo !== undefined) {
    await db.run(`UPDATE todosLists SET todo = ? WHERE id = ?;`, [todo, todoId]);
    res.send("Todo Updated");
  }
});

// DELETE a todo
app.delete("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  await db.run(`DELETE FROM todosLists WHERE id = ?;`, [todoId]);
  res.send("Todo Deleted");
});

module.exports = app;
