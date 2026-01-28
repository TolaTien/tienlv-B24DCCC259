import { useState, useEffect } from 'react';

export interface Todo {
  id: number;
  content: string;
  isCompleted: boolean;
}

export const ToDoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Đọc từ LocalStorage khi khởi chạy
  useEffect(() => {
    const savedTodos = localStorage.getItem('todoList');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Lưu vào LocalStorage mỗi khi todos có thay đổi
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (content: string) => {
    if (!content.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      content,
      isCompleted: false,
    };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, newContent: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, content: newContent } : todo
      )
    );
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    editTodo,
    toggleComplete
  };
};

export default ToDoList;