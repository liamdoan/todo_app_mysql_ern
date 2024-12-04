import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrlDev } from './utils/apiUrl';
import { baseUrlProd } from './utils/apiUrl';
import Spinner from './component/Spinner';
import './App.css';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState('');
    const [desc, setDesc] = useState('');

    const [todoEditing, setTodoEditing] = useState(null);

    const [editingText, setEditingText] = useState('');
    const [editingDesc, setEditingDesc] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await axios.get(`${baseUrlDev}/get`);
                setTodos(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchdata();
    }, []);

    // CREATE a new task
    const addTask = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${baseUrlDev}/save`, {
                task_name: todo,
                task_description: desc,
            });
            console.log(res.data);
            setTodos([...todos, res.data.todo]);
            setTodo('');
            setDesc('');
        } catch (error) {
            console.error(error);
        }
    };

    //Edit/update
    const editTask = async (id) => {
        try {
            const res = await axios.put(`${baseUrlDev}/update/${id}`, {
                task_name: editingText,
                task_description: editingDesc,
            });

            console.log(res.data);

            const updatedTodos = todos.map((todo) =>
                todo.id === id
                    ? {
                          ...todo,
                          task_name: res.data.updatedTodo.task_name,
                          task_description: res.data.updatedTodo.task_description,
                          updated_at: res.data.updatedTodo.updated_at,
                      }
                    : todo
            );

            setTodos(updatedTodos);
            setTodoEditing(null);
            setEditingText('');
            setEditingDesc('');
        } catch (error) {
            console.error(error);
        }
    };

    // Canceling edit/update
    const cancelEditTask = () => {
        setTodoEditing(null);
        setEditingText('');
        setEditingDesc('');
    };

    // Delete
    const deleteTask = async (id) => {
        try {
            const res = await axios.delete(`${baseUrlDev}/delete/${id}`);
            console.log(res.data);
            const updatedTodos = [...todos].filter((todo) => todo.id !== id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error(error);
        }
    };

    // Toggle complete
    const toggleCompleted = async (id) => {
        try {
            const res = await axios.put(`${baseUrlDev}/toggle/${id}`);

            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id ? { ...todo, is_completed: res.data.updatedTodo.is_completed } : todo
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="wrapper">
            <h1>My tasks</h1>
            {/* FORM */}
            <form className="todo-form" onSubmit={addTask}>
                <div className="input-column">
                    <input
                        type="text"
                        placeholder="What to do"
                        onChange={(e) => setTodo(e.target.value)}
                        value={todo}
                        className="todo-input"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                        className="desc-input"
                    />
                </div>
                <button className="submit-button" type="submit">
                    Add Tasks
                </button>
            </form>
            {/* LIST */}
            {loading ? (
                <Spinner />
            ) : (
                todos.map((todo) => (
                    <div className="todo-row" key={todo.id}>
                        {todoEditing === todo.id ? (
                            <div className="input-edit-wrap">
                                <input
                                    className="input-edit-task"
                                    type="text"
                                    onChange={(e) => setEditingText(e.target.value)}
                                    value={editingText}
                                />
                                <input
                                    className="input-edit-desc"
                                    type="text"
                                    onChange={(e) => setEditingDesc(e.target.value)}
                                    value={editingDesc}
                                />
                            </div>
                        ) : (
                            <div className="input-show">
                                <p className="input-show-name">{todo.task_name}</p>
                                <p className="input-show-desc">{todo.task_description}</p>
                                <p className="input-show-time">
                                    <span className="span-time">
                                        Created at: {new Date(todo.created_at).toLocaleString()}
                                    </span>
                                </p>
                                <p className="input-show-time">
                                    <span className="span-time">
                                        Updated at: {new Date(todo.updated_at).toLocaleString()}
                                    </span>
                                </p>
                            </div>
                        )}
                        {/* 'todo' is changable */}
                        <div className="buttons">
                            {todoEditing === todo.id ? (
                                <>
                                    <button className="submit-edit-btn" onClick={() => editTask(todo.id)}>
                                        Submit Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => cancelEditTask()}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="checkbox"
                                        onChange={() => toggleCompleted(todo.id)}
                                        checked={todo.is_completed}
                                        className="check-complete"
                                    />
                                    <br />
                                    <button
                                        className="edit-btn"
                                        onClick={() => {
                                            setTodoEditing(todo.id);
                                            setEditingText(todo.task_name);
                                            setEditingDesc(todo.task_description);
                                        }}
                                    >
                                        Edit Tasks
                                    </button>
                                    <button className="delete-btn" onClick={() => deleteTask(todo.id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default App;
