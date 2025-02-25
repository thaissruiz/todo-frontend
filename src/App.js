import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://todo-api-givw.onrender.com/api/todos"; // URL correta da API

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // Buscar tarefas da API ao carregar a página
  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        if (Array.isArray(res.data)) {
          setTodos(res.data);
        } else {
          console.error("Resposta inesperada da API:", res.data);
          setTodos([]);
        }
      })
      .catch(err => console.error("Erro ao buscar tarefas:", err));
  }, []);

  // Adicionar nova tarefa
  const addTodo = async () => {
    if (text.trim()) {
      try {
        const res = await axios.post(API_URL, { text }); // Correção na URL
        setTodos([...todos, res.data]);
        setText('');
      } catch (err) {
        console.error("Erro ao adicionar tarefa:", err);
      }
    }
  };

  // Alternar status de concluído
  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const res = await axios.put(`${API_URL}/${id}`, { completed: !todo.completed }); // Correção na URL
      setTodos(todos.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
    }
  };

  // Remover tarefa
  const removeTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`); // Correção na URL
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error("Erro ao remover tarefa:", err);
    }
  };

  return (
    <div className="App">
      <h1>Lista de Tarefas</h1>
      <input 
        value={text} 
        onChange={e => setText(e.target.value)} 
        placeholder="Nova tarefa" 
      />
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