import React, { useState, useEffect } from 'react';

const API_URL = "https://todo-api-givw.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // Buscar tarefas da API
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar as tarefas');
        }
        return response.json();
      })
      .then(data => setTodos(data))
      .catch(error => console.error('Erro:', error));
  }, []);

  // Adicionar tarefa
  const addTodo = async () => {
    if (text.trim()) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        setText('');
      } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
      }
    }
  };

  // Alternar status de concluído
  const toggleComplete = async (id) => {
    const todo = todos.find(t => t._id === id);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map(t => (t._id === id ? updatedTodo : t)));
    } catch (error) {
      console.error('Erro ao alternar tarefa:', error);
    }
  };

  // Remover tarefa
  const removeTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(t => t._id !== id));
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
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