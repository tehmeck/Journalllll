import React from 'react';
import { TodoItem } from '../types';
import { CheckCircle, RotateCcw, Trash2 } from 'lucide-react';

interface CompletedTasksViewProps {
  todos: TodoItem[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

export const CompletedTasksView: React.FC<CompletedTasksViewProps> = ({ todos, setTodos }) => {
  const clearedTodos = todos.filter(t => t.isCleared);

  const restoreTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, isCleared: false } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 pb-32">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
        <CheckCircle className="mr-3 text-journal-accent" size={28} />
        Completed Tasks
      </h2>

      {clearedTodos.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-journal-600 rounded-xl">
          <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No completed tasks yet</p>
          <p className="text-sm">Tasks you clear from the bottom panel will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {clearedTodos.map(todo => (
            <div key={todo.id} className="bg-journal-800 p-4 rounded-xl border border-journal-600 flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="text-gray-300 line-through mb-1">{todo.text}</span>
                <span className="text-xs text-journal-accent">Completed at {todo.completedAt}</span>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => restoreTodo(todo.id)}
                  className="p-2 bg-journal-900 rounded-full text-gray-400 hover:text-white transition-colors"
                  title="Restore to active tasks"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 bg-journal-900 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete permanently"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
