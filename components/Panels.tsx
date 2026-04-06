import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Check, X, Maximize2, Minimize2, Plus } from 'lucide-react';
import { TodoItem } from '../types';

interface BottomPanelProps {
  todos: TodoItem[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

const formatDateStamp = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${yyyy}-${mm}-${dd}\n${time}`;
};

export const BottomPanel: React.FC<BottomPanelProps> = ({ todos, setTodos }) => {
  const [expanded, setExpanded] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const item: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      createdAt: formatDateStamp(new Date())
    };
    setTodos([item, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        return { 
          ...t, 
          completed, 
          completedAt: completed ? formatDateStamp(new Date()) : undefined 
        };
      }
      return t;
    }));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // Clear completed button logic
  const clearCompleted = () => {
    setTodos(todos.map(t => t.completed ? { ...t, isCleared: true } : t));
  };

  const visibleTodos = todos.filter(t => !t.isCleared);
  const uncompletedTodos = visibleTodos.filter(t => !t.completed);
  const completedTodos = visibleTodos.filter(t => t.completed);

  return (
    <>
      {expanded && (
        <div className="fixed inset-0 z-50" onClick={() => setExpanded(false)} />
      )}
      <div 
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center transition-all duration-300
          ${expanded ? 'w-full' : 'w-32'}
        `}
      >
        {/* Tab */}
        <div 
          className="h-8 px-4 bg-journal-800 border-t border-x border-journal-600 rounded-t-lg flex items-center justify-center cursor-pointer hover:bg-journal-700 transition-colors shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] w-32 shrink-0"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="font-semibold text-xs text-gray-300 mr-2">ToDo ({uncompletedTodos.length})</span>
          {expanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronUp size={14} className="text-gray-400" />}
        </div>

        {/* Content */}
        <div className={`w-full bg-journal-800 border-t border-x border-journal-600 rounded-t-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${expanded ? 'h-[80vh] p-4' : 'h-0 p-0 border-none'}`}>
          {expanded && (
            <>
              <form onSubmit={addTodo} className="flex mb-4 w-full shrink-0">
                <input 
                  type="text" 
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 min-w-0 bg-journal-900 border border-journal-600 rounded-l px-3 py-2 text-white outline-none focus:border-journal-accent"
                />
                <button type="submit" className="bg-journal-accent text-journal-900 px-4 py-2 rounded-r font-bold hover:opacity-90 shrink-0">
                  <Plus size={18} />
                </button>
              </form>

              <div className="flex-1 overflow-y-auto space-y-2">
                {uncompletedTodos.map(todo => (
                  <div key={todo.id} className="flex items-start group bg-journal-900 p-2 rounded border border-journal-600/50">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id); }}
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-3 mt-0.5 shrink-0 transition-colors
                        ${todo.completed ? 'bg-journal-accent border-journal-accent' : 'border-gray-500 hover:border-journal-accent'}
                      `}
                    >
                      {todo.completed && <Check size={14} className="text-black" />}
                    </button>
                    <span className={`flex-1 text-sm mt-0.5 ${todo.completed ? 'text-gray-500' : 'text-gray-200'}`}>
                      {todo.text}
                    </span>
                    <div className="text-xs text-gray-500 ml-3 mt-1 shrink-0 text-right">
                      <div className="block">{todo.createdAt.split('\n')[0]}</div>
                      <div className="block">{todo.createdAt.split('\n')[1]}</div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeTodo(todo.id); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 shrink-0 ml-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {completedTodos.length > 0 && (
                  <>
                    <div className="h-px bg-journal-600 my-4"></div>
                    {completedTodos.map(todo => (
                      <div key={todo.id} className="flex items-start group bg-journal-900 p-2 rounded border border-journal-600/50">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id); }}
                          className={`w-5 h-5 rounded border flex items-center justify-center mr-3 mt-0.5 shrink-0 transition-colors
                            ${todo.completed ? 'bg-journal-accent border-journal-accent' : 'border-gray-500 hover:border-journal-accent'}
                          `}
                        >
                          {todo.completed && <Check size={14} className="text-black" />}
                        </button>
                        <span className={`flex-1 text-sm mt-0.5 ${todo.completed ? 'text-gray-500' : 'text-gray-200'}`}>
                          {todo.text}
                        </span>
                        <div className="text-xs text-journal-accent ml-3 mt-1 shrink-0 text-right">
                          <div className="block">{todo.completedAt?.split('\n')[0]}</div>
                          <div className="block">{todo.completedAt?.split('\n')[1]}</div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeTodo(todo.id); }}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 shrink-0 ml-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
              
              {completedTodos.length > 0 && (
                  <button onClick={clearCompleted} className="text-xs text-gray-500 hover:text-white mt-2 self-end shrink-0">
                      Clear Completed
                  </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const RightPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState('');

  return (
    <>
      {expanded && (
        <div className="fixed inset-0 z-[55]" onClick={() => setExpanded(false)} />
      )}
      <div 
        className={`fixed right-0 z-[60] flex items-start transition-all duration-300
          ${expanded ? 'top-16 bottom-10 w-[calc(100vw-4rem)] md:w-1/2' : 'top-32 h-40 w-8'}
        `}
      >
        <div 
          className={`w-8 h-40 bg-journal-800 border-l border-y border-journal-600 rounded-l-lg flex flex-col items-center justify-center cursor-pointer hover:bg-journal-700 transition-colors shrink-0 shadow-lg
            ${expanded ? 'mt-16' : 'mt-0'}
          `}
          onClick={() => setExpanded(!expanded)}
        >
          <span 
            className="text-xs font-bold text-gray-400 tracking-widest uppercase" 
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Scratchpad
          </span>
          <div className="mt-3">
             {expanded ? <Minimize2 size={16} className="text-gray-400" /> : <Maximize2 size={16} className="text-gray-400" />}
          </div>
        </div>

        {expanded && (
          <div className="flex-1 h-full bg-journal-800 border-l border-journal-600 shadow-2xl p-4 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">Persistent Scratchpad</h3>
            <textarea 
              className="flex-1 bg-journal-900 rounded p-4 text-gray-300 outline-none resize-none border border-journal-600 focus:border-journal-accent"
              placeholder="Quick notes that stick around..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        )}
      </div>
    </>
  );
};