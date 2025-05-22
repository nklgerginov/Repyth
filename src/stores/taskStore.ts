import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch tasks error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks', 
        isLoading: false 
      });
    }
  },

  addTask: async (title, description) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await axios.post(
        `${API_URL}/tasks`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ 
        tasks: [...get().tasks, response.data], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Add task error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add task', 
        isLoading: false 
      });
    }
  },

  updateTask: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await axios.patch(
        `${API_URL}/tasks/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      set({
        tasks: get().tasks.map(task => 
          task.id === id ? { ...task, ...response.data } : task
        ),
        isLoading: false
      });
    } catch (error) {
      console.error('Update task error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update task', 
        isLoading: false 
      });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({
        tasks: get().tasks.filter(task => task.id !== id),
        isLoading: false
      });
    } catch (error) {
      console.error('Delete task error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete task', 
        isLoading: false 
      });
    }
  },
}));