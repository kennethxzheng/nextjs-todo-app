"use client";

import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/todo");
      setTodos(response.data);
    } catch (err) {
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") {
      setError("Title is required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/todo", { title: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (err) {
      setError("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id, title) => {
    setLoading(true);
    try {
      const response = await axios.put("/api/todo", { id, title });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (err) {
      setError("Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await axios.delete("/api/todo", { data: { id } });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">TO DO APPLICATION</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="input mr-2"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="btn" onClick={addTodo} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="w-full max-w-md">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center mb-2">
              <input
                type="text"
                className="input flex-grow mr-2"
                value={todo.title}
                onChange={(e) => updateTodo(todo.id, e.target.value)}
              />
              <button className="btn" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
              <span className="text-sm text-gray-500 ml-2">
                Created: {new Date(todo.createdAt).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                Updated: {new Date(todo.updatedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
