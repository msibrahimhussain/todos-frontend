import React, {useEffect, useState} from 'react'

// const API_URL = 'https://todos-backend-vbqp.onrender.com', https://todos-backend-1-8jer.onrender.com

const API_URL = 'http://localhost:3001/todos' // backend

export default function TodosApp() {
  const [todos, setTodos] = useState([])
  const [showTodos, setShowTodos] = useState(true)

  const [formData, setFormData] = useState({
    id: '',
    todo: '',
    priority: 'HIGH',
    status: 'TO DO',
    category: 'LEARNING',
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
        body: JSON.stringify({...formData, id: editId}),
      })
      setEditId(null)
      setShowTodos(true) // Show todos after add or update
    } else {
      const maxId =
        todos.length > 0 ? Math.max(...todos.map(todo => Number(todo.id))) : 0
      const newTodo = {...formData, id: (maxId + 1).toString()}
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newTodo),
      })
    }
    setFormData({
      id: '',
      todo: '',
      priority: 'HIGH',
      status: 'TO DO',
      category: 'LEARNING',
    })
    fetchTodos()
  }

  const handleEdit = todo => {
    setFormData(todo)
    setEditId(todo.id)
    setShowTodos(false) // Hide todos when editing
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
      <div className="top-section">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter todo"
            value={formData.todo}
            onChange={e => setFormData({...formData, todo: e.target.value})}
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
          <select
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="TO DO">TO DO</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          <select
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="LEARNING">LEARNING</option>
            <option value="WORK">WORK</option>
            <option value="HOME">HOME</option>
          </select>
          <button type="submit">{editId ? 'Update' : 'Add'} Todo</button>
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
      </div>
      {showTodos && (
        <div className="todo-list">
          {filteredTodos.map(todo => (
            <div key={todo.id} className="todo-card">
              <div className="todo-header">
                <h3>{todo.todo}</h3>
                <button onClick={() => handleEdit(todo)}>Edit</button>
              </div>
              <div className="todo-content">
                <p>
                  <strong>Priority:</strong> {todo.priority}
                </p>
                <p>
                  <strong>Category:</strong> {todo.category}
                </p>
                <div className="todo-footer">
                  <p>
                    <strong>Status:</strong> {todo.status}
                  </p>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to bottom right, #0f2027, #203a43, #2c5364);
        }
        .app-container {
          padding: 2rem;
          min-height: 100vh;
          color: #fff;
        }
        .top-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 1024px) {
          .top-section {
            flex-direction: row;
            justify-content: space-between;
          }
          .todo-list {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
          }
          .todo-card {
            flex: 1 1 calc(33% - 1rem);
          }
        }
        .form, .filter, .todo-card {
          background-color: rgba(255, 255, 255, 0.07);
          border: 1px solid #00ffcc;
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        input, select, button {
          margin: 0.5rem;
          padding: 0.5rem;
          border: 1px solid #00ffcc;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          border-radius: 5px;
        }
        select option {
          color: black;
        }
        .todo-card {
          box-shadow: 0 4px 12px rgba(0, 255, 204, 0.2);
          transition: transform 0.2s ease;
        }
        .todo-card:hover {
          transform: scale(1.02);
          background-color: rgba(0, 255, 204, 0.05);
        }
        .todo-card h3, .todo-card p {
          margin: 0.2rem 0;
        }
        .todo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .todo-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.2rem;
        }
        .todo-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  )
}

// RJSCPC7UBX
