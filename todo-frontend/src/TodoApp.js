import React, { Component } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./api";
import "./TodoApp.css"; // single CSS file

class TodoApp extends Component {
  state = { todoList: [], newTodo: "",newPriority: "LOW", filterStatus: "ALL", filterPriority: "ALL" };

  componentDidMount() {
    this.loadTodos();
  }

  loadTodos = () => {
    getTodos().then((data) => this.setState({ todoList: data }));
  };

  handleAdd = () => {
    const { newTodo,newPriority} = this.state;
    if (!newTodo) return;

    const todoObj = {
      todo: newTodo, // id auto created in DB
      priority: newPriority,
      status: "TO DO",
    };

    addTodo(todoObj).then(() => {
      this.setState({ newTodo: "" ,newPriority: "LOW"});
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
    const { todoList, newTodo, newPriority,filterStatus,filterPriority } = this.state;
    const filteredTodos=todoList.filter((t)=>{
      const statusMatch= filterStatus==="ALL" || t.status === filterStatus;
      const priorityMatch= filterPriority==="ALL" || t.priority === filterPriority;
      return statusMatch && priorityMatch;
    })

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
          <select value={newPriority} onChange={(e)=>this.setState({newPriority: e.target.value})}>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
          </select>
          <button onClick={this.handleAdd}>Add Todo</button>
        </div>
        <div className="filters">
          <label>
            Status: 
            <select value={filterStatus} onChange={(e)=>this.setState({filterStatus: e.target.value})}>
                <option value="ALL">ALL</option>
                <option value="TO DO">TO DO</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
            </select>
          </label>
          <label>
            Priority: 
            <select value={filterPriority} onChange={(e)=>this.setState({filterPriority: e.target.value})}>
              <option value="ALL">ALL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>

            </select>
          </label>

        </div>
        <h1 className="h2">Total Tasks: <span>{filteredTodos.length}</span></h1>

        {/* List Section */}
        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <div>
              <img src="https://assets.ccbp.in/frontend/react-js/comments-app/comments-img.png " alt="Comments"/>
              <p className="empty">No Todos Yet</p>
            </div>
            
          ) : (
            filteredTodos.map((t) => (
              <li key={t.id} className="todo-item">
                <div className="todo-text">
                  <b>{t.todo}</b>{" "}
                  <span
                    className={`priority-badge ${
                      t.priority === "HIGH"
                        ? "high"
                        : t.priority === "MEDIUM"
                        ? "medium"
                        : "low"
                    }`}
                  >
                    {t.priority}
                  </span>{" "}
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
                  <button onClick={() => this.handleDelete(t.id)}>
                      <img src="https://assets.ccbp.in/frontend/react-js/comments-app/delete-img.png" alt="delete" className="img"/>
                  </button>
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
