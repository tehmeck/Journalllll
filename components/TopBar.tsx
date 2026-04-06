import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Settings, User, Cloud, RefreshCw, X, Shield, Monitor, CheckSquare, BarChart2 } from 'lucide-react';
import { UserStats, AppView } from '../types';

interface TopBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  lastBackup: Date;
  stats: UserStats;
  selectionMode: boolean;
  onToggleSelectionMode: () => void;
  setView: (view: AppView) => void;
}

const TopBar: React.FC<TopBarProps> = ({ searchQuery, onSearch, lastBackup, stats, selectionMode, onToggleSelectionMode, setView }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'premium'>('general');
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filters = [
    "tags: (type to search tags) + (type to search tags)",
    "ToDo Entry",
    "last week",
    "last 30 days",
    "last 90 days",
    "contains image",
    "contains audio",
    "longer than 350 words",
    "shorter than 100 words"
  ];

  return (
    <>
      <div className="h-16 bg-journal-900 border-b border-journal-600 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40 pl-16 transition-all">
        
        {/* Search Bar */}
        <div className={`flex-1 max-w-2xl flex items-center bg-journal-800 rounded-lg px-3 py-2 mx-4 group focus-within:bg-white focus-within:text-black focus-within:shadow-md transition-colors ${searchQuery ? 'bg-white text-black shadow-md' : ''}`}>
          <button 
            className={`${searchQuery ? 'text-black' : 'text-gray-400 group-focus-within:text-black'}`}
            onClick={() => searchQuery && onSearch('')}
          >
            {searchQuery ? <X size={20} /> : <Search size={20} />}
          </button>
          <input 
            type="text"
            value={searchQuery}
            placeholder="Search..."
            className={`bg-transparent border-none outline-none ml-3 flex-1 w-full ${searchQuery ? 'text-black' : 'text-white group-focus-within:text-black'}`}
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`${searchQuery ? 'text-black' : 'text-gray-400 hover:text-white group-focus-within:text-black'} ml-2 p-1 rounded hover:bg-gray-200 transition-colors`}
            >
              <Filter size={18} />
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-72 bg-journal-800 border border-journal-600 rounded-lg shadow-xl z-50 py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-journal-700 mb-2">
                  Filters
                </div>
                {filters.map((filter, idx) => (
                  <button 
                    key={idx}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-journal-700 hover:text-white transition-colors"
                    onClick={() => {
                      onSearch(searchQuery ? `${searchQuery} ${filter}` : filter);
                      setShowFilters(false);
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          
          <button 
            onClick={onToggleSelectionMode}
            className={`p-2 rounded-full transition-colors flex items-center ${selectionMode ? 'bg-journal-accent text-journal-900' : 'text-gray-400 hover:bg-journal-800 hover:text-white'}`}
            title={selectionMode ? "Exit Selection Mode" : "Select Notes"}
          >
            <CheckSquare size={20} />
          </button>

          {/* Backup Status */}
          <div className="relative group flex items-center text-gray-400 hover:text-journal-accent cursor-pointer">
            <Cloud size={20} />
            <span className="absolute top-full right-0 mt-2 hidden group-hover:block w-48 bg-black text-white text-xs p-2 rounded shadow-lg border border-journal-600 z-50">
              Last backup: {lastBackup.toLocaleTimeString()}
            </span>
          </div>

          {/* Settings Button */}
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="p-2 text-gray-400 hover:bg-journal-800 hover:text-white rounded-full transition-colors"
          >
            <Settings size={20} />
          </button>

          {/* Profile */}
          <div className="relative">
            <button 
               onClick={() => setShowProfileMenu(!showProfileMenu)}
               className="w-8 h-8 bg-journal-accent rounded-full flex items-center justify-center text-journal-900 font-bold hover:opacity-80 transition-opacity"
            >
              <User size={18} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-journal-800 border border-journal-600 rounded-lg shadow-xl z-50 overflow-hidden">
                 <div className="p-4 border-b border-journal-600 text-center">
                   <div className="w-12 h-12 bg-journal-accent rounded-full mx-auto flex items-center justify-center mb-2">
                      <User size={24} className="text-journal-900" />
                   </div>
                   <h3 className="text-white font-medium">Demo User</h3>
                   <p className="text-xs text-gray-400">user@example.com</p>
                 </div>
                 <div className="p-2">
                   <button 
                      onClick={() => {
                        setView(AppView.STATS);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-journal-700 rounded flex items-center"
                   >
                      <BarChart2 size={14} className="mr-2"/> Statistics
                   </button>
                   <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-journal-700 rounded flex items-center">
                      <RefreshCw size={14} className="mr-2"/> Switch Account
                   </button>
                   <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-journal-700 rounded">
                      Public Profile
                   </button>
                 </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-journal-900 border border-journal-600 w-full max-w-5xl h-[85vh] rounded-xl flex overflow-hidden shadow-2xl relative">
             <button 
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-10"
             >
                <X size={24} />
             </button>

             {/* Modal Sidebar */}
             <div className="w-64 bg-journal-800 border-r border-journal-600 flex flex-col pt-6 pb-4">
                <h2 className="text-2xl font-bold text-white mb-8 px-6">Settings</h2>
                
                <div className="flex-1 space-y-1 px-2">
                  <button 
                    onClick={() => setActiveSettingsTab('general')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSettingsTab === 'general' ? 'bg-journal-700 text-white' : 'text-gray-400 hover:bg-journal-700 hover:text-white'}`}
                  >
                    <Monitor size={18} />
                    <span>General</span>
                  </button>
                  <button 
                    onClick={() => setActiveSettingsTab('premium')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSettingsTab === 'premium' ? 'bg-journal-700 text-yellow-500' : 'text-gray-400 hover:bg-journal-700 hover:text-white'}`}
                  >
                    <Shield size={18} />
                    <span>Premium</span>
                  </button>
                </div>
             </div>

             {/* Modal Content */}
             <div className="flex-1 overflow-y-auto bg-journal-900 p-8">
               {activeSettingsTab === 'general' && (
                 <div className="max-w-2xl space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4 border-b border-journal-600 pb-2">Appearance</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                           <span className="text-gray-300">Theme</span>
                           <select className="bg-journal-800 border border-journal-600 text-white rounded px-3 py-1 outline-none focus:border-journal-accent">
                             <option>Dark (Default)</option>
                             <option>Light</option>
                             <option>System</option>
                           </select>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-gray-300">Font Size</span>
                           <select className="bg-journal-800 border border-journal-600 text-white rounded px-3 py-1 outline-none focus:border-journal-accent">
                             <option>Small</option>
                             <option>Medium</option>
                             <option>Large</option>
                           </select>
                         </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4 border-b border-journal-600 pb-2">Notifications</h3>
                      <div className="space-y-3">
                         <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" className="accent-journal-accent" defaultChecked />
                            <span className="text-gray-300">Daily Reminder to Journal</span>
                         </label>
                         <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" className="accent-journal-accent" defaultChecked />
                            <span className="text-gray-300">Weekly Insights Summary</span>
                         </label>
                      </div>
                    </div>
                 </div>
               )}

               {activeSettingsTab === 'premium' && (
                 <div className="max-w-2xl space-y-6">
                    <div className="bg-gradient-to-r from-yellow-900/40 to-journal-900 border border-yellow-600/30 rounded-xl p-6">
                       <h3 className="text-2xl font-bold text-yellow-500 mb-2">JournALL Premium</h3>
                       <p className="text-gray-300 mb-4">Unlock the full power of your personal history.</p>
                       <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors">
                         Upgrade Now
                       </button>
                    </div>

                    <div className="space-y-4 opacity-50 pointer-events-none">
                       <h4 className="font-semibold text-gray-400 uppercase tracking-wide text-xs">Premium Features</h4>
                       <div className="p-4 bg-journal-800 rounded border border-journal-600">
                          <h5 className="font-medium text-white">Cloud Backup</h5>
                          <p className="text-sm text-gray-400">Google Drive, Dropbox, OneDrive</p>
                       </div>
                       <div className="p-4 bg-journal-800 rounded border border-journal-600">
                          <h5 className="font-medium text-white">Export Data</h5>
                          <p className="text-sm text-gray-400">PDF, Markdown, JSON, HTML</p>
                       </div>
                       <div className="p-4 bg-journal-800 rounded border border-journal-600">
                          <h5 className="font-medium text-white">Integrations</h5>
                          <p className="text-sm text-gray-400">Notion, Evernote, Roam Research</p>
                       </div>
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;