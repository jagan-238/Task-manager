const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// In-memory task storage
let tasks = [
  { id: 1, title: "Review project requirements", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Set up development environment", completed: true, createdAt: new Date().toISOString() },
];
let nextId = 3;

// GET /tasks — fetch all tasks
app.get("/tasks", (req, res) => {
  const { search } = req.query;
  let result = tasks;

  if (search && search.trim()) {
    const query = search.trim().toLowerCase();
    result = tasks.filter((t) => t.title.toLowerCase().includes(query));
  }

  res.status(200).json(result);
});

// POST /tasks — create a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Task title is required and must be a non-empty string." });
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length > 200) {
    return res.status(400).json({ error: "Task title must be 200 characters or fewer." });
  }

  const newTask = {
    id: nextId++,
    title: trimmedTitle,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id — toggle completed status
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found.` });
  }

  task.completed = !task.completed;
  res.status(200).json(task);
});

// DELETE /tasks/:id — delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task with id ${id} not found.` });
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: "Task deleted successfully." });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Task Manager API running at http://localhost:${PORT}`);
});
