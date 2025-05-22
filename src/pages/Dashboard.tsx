import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import AddTaskForm from '../components/AddTaskForm';
import TaskCard from '../components/TaskCard';
import { ListFilter, CheckCircle, Circle } from 'lucide-react';
import Button from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const { tasks, fetchTasks, isLoading } = useTaskStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Tasks</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your tasks efficiently
          </p>
        </div>
        
        <AddTaskForm />
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-400">
              <CheckCircle size={16} className="text-success-500" />
              <span>{completedCount} completed</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-400">
              <Circle size={16} className="text-primary-500" />
              <span>{activeCount} active</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
              <ListFilter size={16} className="mr-1" />
              Filter:
            </span>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant={filter === 'all' ? 'primary' : 'ghost'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === 'active' ? 'primary' : 'ghost'}
                onClick={() => setFilter('active')}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={filter === 'completed' ? 'primary' : 'ghost'}
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid gap-4">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <p className="text-neutral-600 dark:text-neutral-400">
              {tasks.length === 0 
                ? 'You have no tasks yet. Create your first task!' 
                : 'No tasks match your current filter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;