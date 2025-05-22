import React, { useState } from 'react';
import { CheckCircle, Circle, Edit, Trash, X } from 'lucide-react';
import { Task, useTaskStore } from '../stores/taskStore';
import Button from './ui/Button';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleSave = () => {
    if (title.trim()) {
      updateTask(task.id, { title, description });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (isConfirmingDelete) {
      deleteTask(task.id);
    } else {
      setIsConfirmingDelete(true);
    }
  };

  const cancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 transition-all duration-300 ${
      task.completed ? 'opacity-75' : ''
    }`}>
      {isEditing ? (
        <div className="p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-transparent"
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-4 p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-transparent min-h-[80px]"
            placeholder="Task description"
          />
          <div className="flex justify-end space-x-2">
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-start space-x-2">
              <button 
                onClick={handleToggleComplete}
                className="mt-1 text-primary-500 hover:text-primary-600 transition-colors"
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
              <div>
                <h3 className={`font-medium ${task.completed ? 'line-through text-neutral-500 dark:text-neutral-400' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`mt-1 text-sm text-neutral-600 dark:text-neutral-400 ${task.completed ? 'line-through text-neutral-500 dark:text-neutral-500' : ''}`}>
                    {task.description}
                  </p>
                )}
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                  {formatDate(task.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-1">
              {isConfirmingDelete ? (
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={handleDelete}
                    className="!p-1.5"
                    aria-label="Confirm delete"
                  >
                    <Trash size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancelDelete}
                    className="!p-1.5"
                    aria-label="Cancel delete"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="!p-1.5"
                    aria-label="Edit task"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    className="!p-1.5 text-error-500 hover:text-error-600"
                    aria-label="Delete task"
                  >
                    <Trash size={16} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;