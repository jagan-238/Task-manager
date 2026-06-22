const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function handleResponse(res) {
const data = await res.json();

if (!res.ok) {
throw new Error(data.error || "An unexpected error occurred.");
}

return data;
}

export async function fetchTasks(search = "") {
const url = search.trim()
? `${API_BASE_URL}/tasks?search=${encodeURIComponent(search.trim())}`
: `${API_BASE_URL}/tasks`;

const res = await fetch(url);
return handleResponse(res);
}

export async function createTask(title) {
const res = await fetch(`${API_BASE_URL}/tasks`, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ title }),
});

return handleResponse(res);
}

export async function toggleTask(id) {
const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
method: "PUT",
});

return handleResponse(res);
}

export async function deleteTask(id) {
const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
method: "DELETE",
});

return handleResponse(res);
}
