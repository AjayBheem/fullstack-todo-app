import React, { Component } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./api";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import "./TodoApp.css"; // single CSS file

class TodoApp extends Component {
  state = { todoList: [], newTodo: "",newPriority: "LOW", filterStatus: "ALL", filterPriority: "ALL",searchText: "" };

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

  handleLogout=()=>{
    Cookies.remove("jwt_token");
    Cookies.remove("username");
    window.location.href="/";
  }

  render() {
    const username=Cookies.get("username") ||"User";

    const { todoList, newTodo, newPriority,filterStatus,filterPriority } = this.state;
    const filteredTodos=todoList.filter((t)=>{
      const statusMatch= filterStatus==="ALL" || t.status === filterStatus;
      const priorityMatch= filterPriority==="ALL" || t.priority === filterPriority;
      const searchMatch=t.todo.toLowerCase().includes(this.state.searchText.toLowerCase());
      return statusMatch && priorityMatch && searchMatch;
    })
    const jwtToken=Cookies.get("jwt_token");
    if(jwtToken===undefined){
      return <Navigate to="/"/>
    }

    return (
      <div className="todo-container">
        <div className="todo-header">
            <h1 className="title">Welcome, {username}</h1>
            <button className="logout-btn" onClick={this.handleLogout}>
              Logout
            </button>
        </div>
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
        <div className="search-bar">
            <img src="https://assets.ccbp.in/frontend/react-js/google-search-icon.png" alt="search icon"/>
            <input 
            type="search" 
            placeholder="Search todos..." 
            value={this.state.searchText} 
            onChange={(e)=>this.setState({searchText: e.target.value})}
            />
        </div>

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
                  <b className={t.status === "DONE" ? "done-text": ""}>{t.todo}</b>{" "}
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
