import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  name: string;
  assignee: string;
  priority: 'Thấp' | 'Trung bình' | 'Cao';
  deadline: string;
  status: 'Chưa làm' | 'Đang làm' | 'Đã xong';
}

export default () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('group_tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    }

    const savedUser = localStorage.getItem('task_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('group_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const login = (name: string) => {
    setCurrentUser(name);
    localStorage.setItem('task_user', name);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('task_user');
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const editTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return {
    tasks,
    currentUser,
    login,
    logout,
    addTask,
    editTask,
    deleteTask,
  };
};
