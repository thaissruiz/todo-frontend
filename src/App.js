import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://todo-api-givw.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // Buscar tarefas da API
  useEffect(() => {
   
    axios.get(`${API_URL}/todos`).then(res => setTodos(res.data));
  }, []);

  // Adicionar tarefa
  const addTodo = async () => {
    if (text.trim()) {
      const res = await axios.post(API_URL, { text });
      setTodos([...todos, res.data]);
      setText('');
    }
  };

  // Alternar status de concluído
  const toggleComplete = async (id) => {
    const todo = todos.find(t => t._id === id);
    const res = await axios.put(`${API_URL}/${id}`, { completed: !todo.completed });
    setTodos(todos.map(t => (t._id === id ? res.data : t)));
  };

  // Remover tarefa
  const removeTodo = async (id) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div className="App">
      <h1>Lista de Tarefas</h1>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Nova tarefa" />
      <button onClick={addTodo}>Adicionar</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
            <button onClick={() => toggleComplete(todo._id)}>✔</button>
            <button onClick={() => removeTodo(todo._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
