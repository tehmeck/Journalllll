import React from 'react';
import { 
  Calendar, StickyNote, Layers, Star, Tag, Lightbulb, 
  History, Archive, CheckCircle, Trash2, Menu
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  expanded: boolean;
  toggleExpanded: () => void;
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ expanded, toggleExpanded, currentView, setView }) => {
  
  const navItems = [
    { id: AppView.TODAY, icon: Calendar, label: 'Today' },
    { id: AppView.PAGES, icon: StickyNote, label: 'Pages' },
    { id: AppView.EVERYTHING, icon: Layers, label: 'Everything' },
    { id: AppView.STARRED, icon: Star, label: 'Starred' },
    { id: AppView.TAGS, icon: Tag, label: 'Tags' },
    { id: AppView.INSIGHTS, icon: Lightbulb, label: 'Insights' },
    { id: AppView.REFLECTIONS, icon: History, label: 'Reflections' },
    { id: AppView.ARCHIVE, icon: Archive, label: 'Archive' },
    { id: AppView.COMPLETED, icon: CheckCircle, label: 'Completed' },
    { id: AppView.DELETED, icon: Trash2, label: 'Deleted' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-journal-900 border-r border-journal-600 transition-all duration-300 z-50 flex flex-col
      ${expanded ? 'w-48' : 'w-12'}`}
    >
      <div className={`h-16 flex items-center border-b border-journal-600 ${expanded ? 'px-2' : 'justify-center'}`}>
        <button 
          onClick={toggleExpanded}
          className="p-2 hover:bg-journal-800 rounded-full text-journal-700 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        {expanded && <span className="ml-2 font-semibold text-xl text-white">JournALL</span>}
      </div>

      <nav className="flex-1 flex flex-col justify-between py-4 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center px-2 py-2 transition-colors
              ${currentView === item.id ? 'bg-journal-800 text-journal-accent' : 'text-gray-400 hover:bg-journal-800 hover:text-white'}
              ${!expanded ? 'justify-center' : ''}
            `}
            title={!expanded ? item.label : ''}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-journal-accent' : ''} />
            {expanded && <span className="ml-4 truncate">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;