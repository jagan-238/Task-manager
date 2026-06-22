export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.completed ? "task-completed" : ""}`}>
      <span className="task-title">{task.title}</span>
      <div className="task-actions">
        <button
          className={`btn btn-sm ${task.completed ? "btn-undo" : "btn-complete"}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? "Undo" : "Complete"}
        </button>
        <button
          className="btn btn-sm btn-delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
