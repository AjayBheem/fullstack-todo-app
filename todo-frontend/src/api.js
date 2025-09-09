const API_URL = "http://localhost:4000/todos/";

export function getTodos() {
  return fetch(API_URL).then((res) => res.json());
}

export function addTodo(todo) {
  // Remove id, backend will generate it
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  }).then((res) => res.text());
}

export function updateTodo(id, updates) {
  return fetch(`${API_URL}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  }).then((res) => res.text());
}

export function deleteTodo(id) {
  return fetch(`${API_URL}${id}/`, { method: "DELETE" }).then((res) =>
    res.text()
  );
}
