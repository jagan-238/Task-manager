import { useState, useEffect, useCallback } from "react";
import { fetchTasks, createTask, toggleTask, deleteTask } from "./api";
import TaskItem from "./TaskItem";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const data = await fetchTasks(searchQuery);
      setTasks(data);
    } catch (err) {
      setApiError(err.message || "Failed to load tasks. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async () => {
    setValidationError("");
    setApiError("");

    if (!inputValue.trim()) {
      setValidationError("Task title cannot be empty.");
      return;
    }

    setAdding(true);
    try {
      const newTask = await createTask(inputValue.trim());
      setTasks((prev) => [newTask, ...prev]);
      setInputValue("");
    } catch (err) {
      setApiError(err.message || "Failed to add task.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id) => {
    setApiError("");
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setApiError(err.message || "Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    setApiError("");
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setApiError(err.message || "Failed to delete task.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Task Manager</h1>
        {!loading && (
          <p className="task-count">
            {completedCount} / {tasks.length} completed
          </p>
        )}
      </header>

      <main className="app-main">
        {/* Add Task */}
        <section className="add-section">
          <div className="input-row">
            <input
              type="text"
              className={`task-input ${validationError ? "input-error" : ""}`}
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (validationError) setValidationError("");
              }}
              onKeyDown={handleKeyDown}
              maxLength={200}
              aria-label="New task title"
            />
            <button
              className="btn btn-primary"
              onClick={handleAddTask}
              disabled={adding}
              aria-label="Add task"
            >
              {adding ? "Adding…" : "Add Task"}
            </button>
          </div>
          {validationError && (
            <p className="validation-msg" role="alert">
              {validationError}
            </p>
          )}
        </section>

        {/* Search */}
        <section className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tasks"
          />
        </section>

        {/* API Error */}
        {apiError && (
          <div className="error-banner" role="alert">
            <span>⚠ {apiError}</span>
            <button className="error-dismiss" onClick={() => setApiError("")}>
              ✕
            </button>
          </div>
        )}

        {/* Task List */}
        <section className="task-list-section">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" aria-label="Loading tasks" />
              <p>Loading tasks…</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>{searchQuery ? "No tasks match your search." : "No tasks yet — add one above."}</p>
            </div>
          ) : (
            <ul className="task-list" role="list">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
