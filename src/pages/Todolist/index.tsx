import React, { useState } from 'react';
import { ToDoList, Todo } from '../../models/TodoList';

const TodoList: React.FC = () => {
  const { todos, addTodo, deleteTodo, editTodo, toggleComplete } = ToDoList();
  const [newTodoText, setNewTodoText] = useState('');
  
  // State để quản lý việc đang sửa item nào
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    addTodo(newTodoText);
    setNewTodoText('');
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.content);
  };

  const saveEdit = (id: number) => {
    editTodo(id, editText);
    setEditingId(null);
    setEditText('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Danh sách công việc</h2>
      
      {/* Form Thêm mới */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Nhập công việc mới..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={handleAdd} style={{ padding: '8px 16px' }}>Thêm</button>
      </div>
      
      {/* Danh sách */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li 
            key={todo.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid #eee',
              backgroundColor: todo.isCompleted ? '#f9f9f9' : 'white'
            }}
          >
            {editingId === todo.id ? (
              // chỉnh sửa
              <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
                <input 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button onClick={() => saveEdit(todo.id)}>Lưu</button>
                <button onClick={() => setEditingId(null)}>Hủy</button>
              </div>
            ) : (
              // hiển thị
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    checked={todo.isCompleted} 
                    onChange={() => toggleComplete(todo.id)} 
                  />
                  <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
                    {todo.content}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => startEdit(todo)}>Sửa</button>
                  <button onClick={() => deleteTodo(todo.id)} style={{ color: 'red' }}>Xóa</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Chưa có công việc nào.</p>}
    </div>
  );
};

export default TodoList;