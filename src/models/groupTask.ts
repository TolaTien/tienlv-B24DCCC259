import { useState, useEffect } from 'react';
import { message } from 'antd';

export type TaskStatus = 'Chưa làm' | 'Đang làm' | 'Đã xong';
export type TaskPriority = 'Thấp' | 'Trung bình' | 'Cao';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
}

export interface User {
  username: string;
  password: string;
}

export const useGroupTaskModel = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Load tasks
    const savedTasks = localStorage.getItem('group_tasks');
    if (savedTasks) {
      try { setTasks(JSON.parse(savedTasks)); } catch (e) { console.error(e); }
    }
    // Load users
    const savedUsers = localStorage.getItem('group_task_users');
    if (savedUsers) {
      try { setUsers(JSON.parse(savedUsers)); } catch (e) { console.error(e); }
    }
    // Load current session
    const savedUser = localStorage.getItem('group_task_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('group_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('group_task_users', JSON.stringify(users));
  }, [users]);

  const login = (username: string, password: string) => {
    const user = users.find(u => u.username === username);
    if (!user) {
      message.error('Người dùng không tồn tại. Vui lòng đăng ký!');
      return false;
    }
    if (user.password !== password) {
      message.error('Mật khẩu không chính xác!');
      return false;
    }
    setCurrentUser(username);
    localStorage.setItem('group_task_user', username);
    message.success('Đăng nhập thành công!');
    return true;
  };

  const register = (username: string, password: string) => {
    if (users.find(u => u.username === username)) {
      message.error('Tên người dùng đã tồn tại!');
      return false;
    }
    const newUsers = [...users, { username, password }];
    setUsers(newUsers);
    message.success('Đăng ký thành công! Hãy đăng nhập.');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('group_task_user');
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Date.now().toString() };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus: TaskStatus = t.status === 'Đã xong' ? 'Đang làm' : 'Đã xong';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return { tasks, currentUser, login, register, logout, addTask, updateTask, deleteTask, toggleStatus };
};

export default useGroupTaskModel;
