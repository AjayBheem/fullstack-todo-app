import React, { Component } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./api";
import "./TodoApp.css"; // single CSS file

class TodoApp extends Component {
  state = { todoList: [], newTodo: "" };

  componentDidMount() {
    this.loadTodos();
  }

  loadTodos = () => {
    getTodos().then((data) => this.setState({ todoList: data }));
  };

  handleAdd = () => {
    const { newTodo } = this.state;
    if (!newTodo) return;

    const todoObj = {
      todo: newTodo, // id auto created in DB
      priority: "MEDIUM",
      status: "TO DO",
    };

    addTodo(todoObj).then(() => {
      this.setState({ newTodo: "" });
      this.loadTodos();
    });
  };

  handleUpdate = (id, status) => {
    updateTodo(id, { status }).then(() => this.loadTodos());
  };

  handleDelete = (id) => {
    deleteTodo(id).then(() => this.loadTodos());
  };

  render() {
    const { todoList, newTodo } = this.state;

    return (
      <div className="todo-container">
        <h1 className="title">Todo App</h1>

        {/* Input Section */}
        <div className="todo-input">
          <input
            type="text"
            placeholder="Enter new todo..."
            value={newTodo}
            onChange={(e) => this.setState({ newTodo: e.target.value })}
          />
          <button onClick={this.handleAdd}>Add Todo</button>
        </div>

        {/* List Section */}
        <ul className="todo-list">
          {todoList.length === 0 ? (
            <p className="empty">No Todos Yet</p>
          ) : (
            todoList.map((t) => (
              <li key={t.id} className="todo-item">
                <div className="todo-text">
                  <b>{t.todo}</b>{" "}
                  <span
                    className={`status-badge ${
                      t.status === "TO DO"
                        ? "todo"
                        : t.status === "IN PROGRESS"
                        ? "progress"
                        : "done"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="actions">
                  <button onClick={() => this.handleUpdate(t.id, "IN PROGRESS")}>
                    In Progress
                  </button>
                  <button onClick={() => this.handleUpdate(t.id, "DONE")}>
                    Done
                  </button>
                  <button onClick={() => this.handleDelete(t.id)}>Delete</button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }
}

export default TodoApp;
