import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos:', err.message);
    }
  };

  const addTodo = async () => {
    try {
      await axios.post('http://localhost:3001/todos', { task });
      setTask('');
      fetchTodos();
    } catch (err) {
      console.error('Add failed:', err.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={task}
        placeholder="Add new task"
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((t, index) => (
          <li key={index}>{t.task}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
