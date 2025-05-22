import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import Button from './ui/Button';
import Input from './ui/Input';

const AddTaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { addTask, isLoading } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      await addTask(title, description);
      setTitle('');
      setDescription('');
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center p-3 text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
        >
          <PlusCircle size={20} className="mr-2" />
          <span>Add New Task</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            autoFocus
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              className="w-full rounded-md border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 shadow-sm"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Add Task
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTaskForm;