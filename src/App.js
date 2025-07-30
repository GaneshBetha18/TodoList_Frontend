import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editingId, setEditingId] = useState(null);

  const getTodos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todos`);
      setTodos(res.data.reverse()); // Show latest first
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch(`${BASE_URL}/todos/${editingId}`, {
          task, status, deadline,
        });
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/todos`, {
          task, status, deadline,
        });
      }
      setTask("");
      setStatus("");
      setDeadline("");
      getTodos();
    } catch (error) {
      console.error("Error submitting todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/todos/${id}`);
      getTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setStatus(todo.status);
    setDeadline(todo.deadline?.slice(0, 16)); // For datetime-local input
    setEditingId(todo._id);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "60px",
      marginTop: "40px",
      backgroundColor: "#f5f6f7",
      padding: "40px",
      borderRadius: "10px"
    }}>
      
      {/* Left: Todo List Table */}
      <div>
        <h2 style={{ textAlign: "center" }}>Todo List</h2>
        <table border="1" cellPadding="10" style={{
          backgroundColor: "#d6ecff",
          borderCollapse: "collapse",
          borderRadius: "12px",
          overflow: "hidden",
          minWidth: "650px"
        }}>
          <thead style={{ backgroundColor: "#b5dbff" }}>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id}>
                <td>{todo.task}</td>
                <td>{todo.status}</td>
                <td>{new Date(todo.deadline).toLocaleString()}</td>
                <td>
                  <button
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      marginRight: "5px",
                      padding: "5px 10px",
                      borderRadius: "5px"
                    }}
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px"
                    }}
                    onClick={() => handleDelete(todo._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: Add/Edit Task Form */}
      <div>
        <h2 style={{ textAlign: "center" }}>{editingId ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Enter Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
            style={{ width: "250px", padding: "8px", marginBottom: "12px", borderRadius: "5px" }}
          />
          <br />
          <input
            placeholder="Enter Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            style={{ width: "250px", padding: "8px", marginBottom: "12px", borderRadius: "5px" }}
          />
          <br />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{ width: "250px", padding: "8px", marginBottom: "20px", borderRadius: "5px" }}
          />
          <br />
          <button type="submit" style={{
            backgroundColor: editingId ? "orange" : "green",
            color: "white",
            padding: "8px 20px",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
            {editingId ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TodoApp;
