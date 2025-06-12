import React, {useEffect, useState} from 'react'

const API_URL = 'http://localhost:3000/todos' // Adjust to match your backend

export default function TodosApp() {
  const [todos, setTodos] = useState([])
  const [formData, setFormData] = useState({
    task: '',
    priority: 'HIGH',
    status: 'TO DO',
  })
  const [editId, setEditId] = useState(null)
  const [filter, setFilter] = useState('')

  const fetchTodos = async () => {
    const res = await fetch(API_URL)
    const data = await res.json()
    setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...formData, status: 'TO DO'}),
      })
      setEditId(null)
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...formData, status: 'TO DO'}),
      })
    }
    setFormData({task: '', priority: 'HIGH', status: 'TO DO'})
    fetchTodos()
  }

  const handleEdit = todo => {
    setFormData(todo)
    setEditId(todo.id)
  }

  const handleDelete = async id => {
    await fetch(`${API_URL}/${id}`, {method: 'DELETE'})
    fetchTodos()
  }

  const filteredTodos = filter
    ? todos.filter(todo => todo.priority === filter)
    : todos

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter task"
          value={formData.task}
          onChange={e => setFormData({...formData, task: e.target.value})}
          required
        />
        <select
          value={formData.priority}
          onChange={e => setFormData({...formData, priority: e.target.value})}
        >
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Task</button>
      </form>

      <div className="filter">
        <label htmlFor="priorityFilter">Filter by Priority:</label>
        <select
          id="priorityFilter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      <div className="todo-list">
        {filteredTodos.map(todo => (
          <div key={todo.id} className="todo-card">
            <h3>{todo.task}</h3>
            <p>Priority: {todo.priority}</p>
            <p>Status: {todo.status}</p>
            <div className="actions">
              <button onClick={() => handleEdit(todo)}>Edit</button>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }
        .app-container {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 60px 80px;
          font-family: Arial, sans-serif;
          background-image: url('https://images.unsplash.com/photo-1518684079-3c830dcef090'); /* black mountain rocks */
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          background-attachment: fixed;
          backdrop-filter: blur(6px);
          color: #f0f0f0;
        }
        h1 {
          text-align: center;
        }
        .form, .filter {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
          background-color: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 10px;
        }
        input, select, button {
          padding: 10px;
          font-size: 1rem;
          background-color: rgba(255, 255, 255, 0.2);
          color: #fff;
          border: 1px solid #39ff14;
          border-radius: 6px;
          outline: none;
        }
        input::placeholder {
          color: #fff;
;
        }
        select {
          appearance: none;
          background-color: transparent;
          color: #fff;
          background-image: url("data:image/svg+xml;utf8,<svg fill='chocolate' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
          background-repeat: no-repeat;
          background-position-x: 100%;
          background-position-y: center;
          padding-right: 30px;
        }
        select option {
          color: black;
        }
        .filter label {
          color: #fff;
        }
        .todo-list {
          display: grid;
          gap: 15px;
          background-color: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 10px;
        }
        .todo-card {
          padding: 15px;
          border: 1px solid #fff;
          border-radius: 10px;
          background-color: rgba(0,0,0,0.4);
          color: #f0f0f0;
        }
        .todo-card h3 {
          margin: 0 0 5px;
        }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .actions button {
          flex: 1;
          padding: 8px;
          background-color: rgba(0,123,255,0.1);
          color: grey;
          border: 1px solid #39ff14;
          border-radius: 5px;
          cursor: pointer;
        }
        .actions button:last-child {
          background-color: rgba(220,53,69,0.1);
        }
        @media (max-width: 600px) {
          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
