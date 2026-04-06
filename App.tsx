import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DailyEditor from './components/DailyEditor';
import { NoteEditor } from './components/NoteEditor';
import { NoteCard } from './components/NoteCard';
import { EntryListView } from './components/EntryListView';
import { TagsView } from './components/TagsView';
import { CompletedTasksView } from './components/CompletedTasksView';
import { ReflectionsView } from './components/ReflectionsView';
import { BottomPanel, RightPanel } from './components/Panels';
import StatsView from './components/StatsView';
import { AppView, JournalEntry, TodoItem, UserStats, TimestampBlock, GeminiInsight } from './types';
import { generateInsight } from './services/geminiService';
import { X, Sparkles, Loader2, StickyNote, Layers, Star, Archive as ArchiveIcon, ChevronLeft, Trash2, CheckCircle, MoreVertical, Tag, Search } from 'lucide-react';

const COLORS = [
  'bg-journal-800',
  'bg-red-900/40',
  'bg-blue-900/40',
  'bg-green-900/40',
  'bg-yellow-900/40',
  'bg-purple-900/40',
  'bg-pink-900/40',
];

const App: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.TODAY);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState<GeminiInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [showBulkTagInput, setShowBulkTagInput] = useState(false);
  const [bulkTag, setBulkTag] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock Data Initialization
  useEffect(() => {
    // Check for today's entry
    const todayStr = new Date().toDateString();
    setEntries(prev => {
        let newEntries = [...prev];
        const hasToday = newEntries.find(e => new Date(e.date).toDateString() === todayStr);
        if(!hasToday) {
            const newEntry: JournalEntry = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
                title: '',
                blocks: [],
                tags: [],
                isStarred: false,
                type: 'daily'
            };
            newEntries = [newEntry, ...newEntries];
        }

        // Add placeholder notes if the list is empty (except for the daily entry we just added)
        if (newEntries.length <= 1) {
          const placeholders: JournalEntry[] = [
            {
              id: 'p1',
              date: new Date(Date.now() - 100000).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
              title: 'Welcome to Pages!',
              blocks: [{ id: 'b1', time: '10:00 AM', text: 'This is the Pages section. Here you can create one-off notes that aren\'t tied to a specific day.\n\nUse this for lists, ideas, or long-form writing.' }],
              tags: ['tips', 'welcome'],
              isStarred: false,
              type: 'note',
              color: COLORS[2]
            },
            {
              id: 'p2',
              date: new Date(Date.now() - 200000).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
              title: 'Star Important Notes',
              blocks: [{ id: 'b2', time: '09:30 AM', text: 'You can star notes to keep them easily accessible in the Starred section.\n\nJust click the star icon in the top right of the note editor or the note card.' }],
              tags: ['tips', 'organization'],
              isStarred: true,
              type: 'note',
              color: COLORS[4]
            },
            {
              id: 'p3',
              date: new Date(Date.now() - 300000).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
              title: 'Archiving Notes',
              blocks: [{ id: 'b3', time: '09:00 AM', text: 'When you\'re done with a note but don\'t want to delete it, you can archive it.\n\nArchived notes disappear from Pages and Everything, but can be found in the Archive section.' }],
              tags: ['tips', 'archive'],
              isStarred: false,
              isArchived: true,
              type: 'note',
              color: COLORS[1]
            },
            {
              id: 'p4',
              date: new Date(Date.now() - 400000).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
              title: 'A Very Long Note to Demonstrate Sizing',
              blocks: [{ id: 'b4', time: '08:00 AM', text: 'This is a much longer note.\n\nIt has multiple paragraphs to show how the masonry layout adapts to different content lengths.\n\nWhen you have a lot to say, the note card will expand vertically to accommodate the text, up to a certain point.\n\nThis makes it easy to scan your notes and see which ones contain more detailed information.\n\nThe masonry layout ensures that space is used efficiently, with shorter notes filling in the gaps left by longer ones.' }],
              tags: ['demo', 'layout'],
              isStarred: false,
              type: 'note',
              color: COLORS[5]
            },
            {
              id: 'p5',
              date: new Date(Date.now() - 500000).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
              title: 'Medium Note',
              blocks: [{ id: 'b5', time: '07:30 AM', text: 'This is a medium-sized note.\n\nIt has just enough content to be taller than a short note, but not as tall as the long one.' }],
              tags: ['demo'],
              isStarred: false,
              type: 'note',
              color: COLORS[3]
            },
            {
              id: 'p6',
              date: new Date(Date.now() - 600000).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
              title: 'Short Note',
              blocks: [{ id: 'b6', time: '07:00 AM', text: 'Just one line here.' }],
              tags: ['demo'],
              isStarred: false,
              type: 'note',
              color: COLORS[6]
            },
            // Reflections Mocks
            {
              id: 'r1',
              date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
              title: '1 Year Ago Today',
              blocks: [{ id: 'rb1', time: '10:00 AM', text: 'This section shows both the daily note and any other notes you made on this day, but in years past. This is what you wrote exactly 1 year ago.' }],
              tags: ['years-past'],
              isStarred: false,
              type: 'daily',
              color: COLORS[0]
            },
            {
              id: 'r2',
              date: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(new Date().setFullYear(new Date().getFullYear() - 2))),
              title: '2 Years Ago Today',
              blocks: [{ id: 'rb2', time: '10:00 AM', text: 'This section shows both the daily note and any other notes you made on this day, but in years past. This is what you wrote exactly 2 years ago.' }],
              tags: ['years-past'],
              isStarred: false,
              type: 'note',
              color: COLORS[1]
            },
            {
              id: 'r3',
              date: new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(new Date().setFullYear(new Date().getFullYear() - 3))),
              title: '3 Years Ago Today',
              blocks: [{ id: 'rb3', time: '10:00 AM', text: 'This section shows both the daily note and any other notes you made on this day, but in years past. This is what you wrote exactly 3 years ago.' }],
              tags: ['years-past'],
              isStarred: false,
              type: 'daily',
              color: COLORS[2]
            },
            {
              id: 'r4',
              date: new Date(new Date().setFullYear(new Date().getFullYear() - 4)).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(new Date().setFullYear(new Date().getFullYear() - 4))),
              title: '4 Years Ago Today',
              blocks: [{ id: 'rb4', time: '10:00 AM', text: 'This section shows both the daily note and any other notes you made on this day, but in years past. This is what you wrote exactly 4 years ago.' }],
              tags: ['years-past'],
              isStarred: false,
              type: 'note',
              color: COLORS[3]
            },
            {
              id: 'r5',
              date: new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(new Date().setFullYear(new Date().getFullYear() - 5))),
              title: '5 Years Ago Today',
              blocks: [{ id: 'rb5', time: '10:00 AM', text: 'This section shows both the daily note and any other notes you made on this day, but in years past. This is what you wrote exactly 5 years ago.' }],
              tags: ['years-past'],
              isStarred: false,
              type: 'daily',
              color: COLORS[4]
            },
            {
              id: 'r30',
              date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(new Date().setDate(new Date().getDate() - 30))),
              title: '30 Days Ago',
              blocks: [{ id: 'rb30', time: '10:00 AM', text: 'This note is from exactly 30 days ago. It helps you reflect on your recent past.' }],
              tags: ['days-past'],
              isStarred: false,
              type: 'note',
              color: COLORS[5]
            },
            {
              id: 'r60',
              date: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(new Date().setDate(new Date().getDate() - 60))),
              title: '60 Days Ago',
              blocks: [{ id: 'rb60', time: '10:00 AM', text: 'This note is from exactly 60 days ago. It helps you reflect on your recent past.' }],
              tags: ['days-past'],
              isStarred: false,
              type: 'note',
              color: COLORS[6]
            },
            {
              id: 'r90',
              date: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString(),
              formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(new Date().setDate(new Date().getDate() - 90))),
              title: '90 Days Ago',
              blocks: [{ id: 'rb90', time: '10:00 AM', text: 'This note is from exactly 90 days ago. It helps you reflect on your recent past.' }],
              tags: ['days-past'],
              isStarred: false,
              type: 'note',
              color: COLORS[0]
            }
          ];
          newEntries = [...newEntries, ...placeholders];
        }

        return newEntries;
    });

    // Mock Todos
    setTodos([
        { id: '1', text: 'Finish the JournALL clone', completed: false, createdAt: '2026-03-11 - 10:00 AM' },
        { id: '2', text: 'Buy groceries', completed: true, createdAt: '2026-03-11 - 09:00 AM', completedAt: '2026-03-11 - 10:30 AM' },
        { id: '3', text: 'This is a checked off task, you can bring it back to the uncompleted section by unchecking it, or clear it from this section, after which you can view it in the completed section along with everything else youve completed over time.', completed: true, createdAt: '2026-03-11 - 08:00 AM', completedAt: '2026-03-11 - 08:30 AM' },
        { id: '4', text: 'When you create a new task, it goes to the top of the list.', completed: false, createdAt: '2026-03-11 - 08:15 AM' },
        { id: '5', text: 'Tasks are stamped with their creation time, and completion time when checked off.', completed: false, createdAt: '2026-03-11 - 08:20 AM' },
    ]);
  }, []);

  const getCurrentEntry = () => {
    // For simplicity in demo, "Today" view always grabs the first entry if it's today's
    // In production, we'd search by date.
    return entries[0];
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const createEntry = (entry: JournalEntry) => {
    setEntries([entry, ...entries]);
  };

  const handleAIInsight = async (context: string) => {
    setAiModalOpen(true);
    setAiLoading(true);
    const insight = await generateInsight(context);
    setAiContent(insight);
    setAiLoading(false);
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedNotes(new Set());
    }
  };

  const handleSelectNote = (id: string) => {
    if (!selectionMode) {
      setSelectionMode(true);
    }
    const newSelection = new Set(selectedNotes);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedNotes(newSelection);
  };

  const handleBulkAction = (action: 'archive' | 'delete' | 'tag') => {
    if (selectedNotes.size === 0) return;

    if (action === 'archive') {
      setEntries(entries.map(e => selectedNotes.has(e.id) ? { ...e, isArchived: true } : e));
      setSelectedNotes(new Set());
      setSelectionMode(false);
    } else if (action === 'delete') {
      setEntries(entries.map(e => selectedNotes.has(e.id) ? { ...e, isDeleted: true } : e));
      setSelectedNotes(new Set());
      setSelectionMode(false);
    } else if (action === 'tag') {
      setShowBulkTagInput(true);
    }
  };

  const handleBulkTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkTag.trim()) return;
    
    setEntries(entries.map(e => {
      if (selectedNotes.has(e.id)) {
        const newTags = e.tags ? [...e.tags] : [];
        if (!newTags.includes(bulkTag.trim())) {
          newTags.push(bulkTag.trim());
        }
        return { ...e, tags: newTags };
      }
      return e;
    }));
    
    setBulkTag('');
    setShowBulkTagInput(false);
    setSelectedNotes(new Set());
    setSelectionMode(false);
  };

  // Calculate Stats
  const stats: UserStats = {
      wordsTyped: entries.reduce((acc, e) => acc + e.blocks.reduce((bAcc, b) => bAcc + b.text.split(' ').length, 0), 0),
      pagesWritten: entries.length,
      tasksAccomplished: todos.filter(t => t.completed).length,
      searchesMade: 12,
      streakDays: 4,
      uniqueWords: 843
  };

  const renderContent = () => {
    if (activeEntryId) {
      const entry = entries.find(e => e.id === activeEntryId);
      const allTags = Array.from(new Set(entries.flatMap(e => e.tags || []))).sort();
      if (entry) {
        if (entry.type === 'note') {
          return <NoteEditor note={entry} updateEntry={updateEntry} onBack={() => setActiveEntryId(null)} allTags={allTags} />;
        } else {
          return (
            <div className="pb-40">
              <button onClick={() => setActiveEntryId(null)} className="mb-4 flex items-center text-gray-400 hover:text-white px-8">
                <ChevronLeft size={20} className="mr-1" /> Back
              </button>
              <DailyEditor entry={entry} updateEntry={updateEntry} onGenerateAI={handleAIInsight} />
            </div>
          );
        }
      }
    }

    const handleCreateNote = () => {
      const now = new Date();
      const newNote: JournalEntry = {
        id: Date.now().toString(),
        date: now.toISOString(),
        formattedDate: new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now),
        title: 'New Note',
        blocks: [{
          id: Date.now().toString(),
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: ''
        }],
        tags: [],
        isStarred: false,
        type: 'note',
        color: COLORS[0]
      };
      createEntry(newNote);
      setActiveEntryId(newNote.id);
    };

    const handleToggleStar = (id: string, current: boolean) => {
      updateEntry(id, { isStarred: !current });
    };

    const handleToggleArchive = (id: string, current: boolean) => {
      updateEntry(id, { isArchived: !current });
    };

    const handleDelete = (id: string) => {
      setEntries(entries.filter(e => e.id !== id));
    };

    const getEntriesForView = (view: AppView): JournalEntry[] => {
      switch (view) {
        case AppView.TODAY:
          return entries.length > 0 ? [entries[0]] : [];
        case AppView.PAGES:
          return entries.filter(e => e.type === 'note' && !e.isArchived && !e.isDeleted);
        case AppView.EVERYTHING:
          return entries.filter(e => !e.isArchived && !e.isDeleted);
        case AppView.STARRED:
          return entries.filter(e => e.isStarred && !e.isDeleted);
        case AppView.ARCHIVE:
          return entries.filter(e => e.isArchived && !e.isDeleted);
        case AppView.DELETED:
          return entries.filter(e => e.isDeleted);
        case AppView.REFLECTIONS:
          return entries.filter(e => e.tags?.includes('years-past') || e.tags?.includes('days-past'));
        default:
          return entries;
      }
    };

    const filterEntriesByQuery = (entriesToFilter: JournalEntry[], query: string): JournalEntry[] => {
      if (!query) return entriesToFilter;
      const lowerQuery = query.toLowerCase();
      
      // Basic text search
      let filtered = entriesToFilter.filter(entry => {
        const titleMatch = entry.title?.toLowerCase().includes(lowerQuery);
        const blocksMatch = entry.blocks.some(b => b.text.toLowerCase().includes(lowerQuery));
        const tagsMatch = entry.tags?.some(t => t.toLowerCase().includes(lowerQuery));
        return titleMatch || blocksMatch || tagsMatch;
      });

      // Handle special filters
      if (lowerQuery.includes('tags:')) {
        const tagMatch = lowerQuery.match(/tags:\s*([a-z0-9- +]+)/i);
        if (tagMatch && tagMatch[1]) {
           const searchTags = tagMatch[1].split('+').map(t => t.trim()).filter(t => t);
           if (searchTags.length > 0) {
             filtered = entriesToFilter.filter(e => 
               searchTags.every(st => e.tags?.some(et => et.toLowerCase().includes(st.toLowerCase())))
             );
           }
        }
      }
      
      if (lowerQuery.includes('longer than 350 words')) {
         filtered = filtered.filter(e => {
            const wordCount = e.blocks.reduce((acc, b) => acc + b.text.split(/\s+/).length, 0);
            return wordCount > 350;
         });
      }
      
      if (lowerQuery.includes('shorter than 100 words')) {
         filtered = filtered.filter(e => {
            const wordCount = e.blocks.reduce((acc, b) => acc + b.text.split(/\s+/).length, 0);
            return wordCount < 100;
         });
      }
      
      if (lowerQuery.includes('last week')) {
         const lastWeek = new Date();
         lastWeek.setDate(lastWeek.getDate() - 7);
         filtered = filtered.filter(e => new Date(e.date) >= lastWeek);
      }
      
      if (lowerQuery.includes('last 30 days')) {
         const last30 = new Date();
         last30.setDate(last30.getDate() - 30);
         filtered = filtered.filter(e => new Date(e.date) >= last30);
      }
      
      if (lowerQuery.includes('last 90 days')) {
         const last90 = new Date();
         last90.setDate(last90.getDate() - 90);
         filtered = filtered.filter(e => new Date(e.date) >= last90);
      }
      
      if (lowerQuery.includes('contains image')) {
         // Mock implementation since we don't have actual image blocks yet
         filtered = filtered.filter(e => e.blocks.some(b => b.text.includes('![') || b.text.includes('<img')));
      }
      
      if (lowerQuery.includes('contains audio')) {
         // Mock implementation since we don't have actual audio blocks yet
         filtered = filtered.filter(e => e.blocks.some(b => b.text.includes('<audio')));
      }

      return filtered;
    };

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      
      if (currentView === AppView.COMPLETED || lowerQuery.includes('todo entry')) {
        const cleanQuery = lowerQuery.replace('todo entry', '').trim();
        const searchResults = todos.filter(t => 
          (currentView === AppView.COMPLETED ? t.isCleared : true) && 
          t.text.toLowerCase().includes(cleanQuery)
        );
        
        return (
          <div className="p-8 pb-32">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Search className="mr-3 text-journal-accent" size={28} />
                Search Results in ToDo
              </h2>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="space-y-4 max-w-3xl">
                {searchResults.map(todo => (
                  <div key={todo.id} className="bg-journal-800 p-4 rounded-xl border border-journal-600 flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className={`text-gray-300 mb-1 ${todo.completed ? 'line-through' : ''}`}>{todo.text}</span>
                      <span className="text-xs text-journal-accent">
                        {todo.completed ? `Completed at ${todo.completedAt}` : `Created at ${todo.createdAt}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search size={48} className="mx-auto text-journal-600 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No results found in ToDo</h3>
                <p className="text-gray-400">Try adjusting your search.</p>
              </div>
            )}
            
            {currentView !== AppView.EVERYTHING && (
              <div className="mt-12 text-center">
                <p className="text-gray-400">
                  Not finding what you're looking for?{' '}
                  <button 
                    onClick={() => handleSetView(AppView.EVERYTHING)}
                    className="text-journal-accent hover:underline font-medium"
                  >
                    Click here to search the Everything section
                  </button>
                </p>
              </div>
            )}
          </div>
        );
      }

      const viewEntries = getEntriesForView(currentView);
      const searchResults = filterEntriesByQuery(viewEntries, searchQuery);
      
      return (
        <div className="p-8 pb-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Search className="mr-3 text-journal-accent" size={28} />
              Search Results
            </h2>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {searchResults.map(entry => (
                <NoteCard 
                  key={entry.id} 
                  note={entry} 
                  onClick={() => setActiveEntryId(entry.id)} 
                  onToggleStar={(e) => {
                    e.stopPropagation();
                    handleToggleStar(entry.id, !!entry.isStarred);
                  }}
                  onToggleArchive={(e) => {
                    e.stopPropagation();
                    handleToggleArchive(entry.id, !!entry.isArchived);
                  }}
                  selectionMode={selectionMode}
                  isSelected={selectedNotes?.has(entry.id)}
                  onSelect={(e) => {
                    e.stopPropagation();
                    handleSelectNote(entry.id);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-journal-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No results found in {currentView}</h3>
              <p className="text-gray-400">Try adjusting your search or filters.</p>
            </div>
          )}
          
          {currentView !== AppView.EVERYTHING && (
            <div className="mt-12 text-center">
              <p className="text-gray-400">
                Not finding what you're looking for?{' '}
                <button 
                  onClick={() => handleSetView(AppView.EVERYTHING)}
                  className="text-journal-accent hover:underline font-medium"
                >
                  Click here to search the Everything section
                </button>
              </p>
            </div>
          )}
        </div>
      );
    }

    switch (currentView) {
      case AppView.TODAY:
        const todayStr = new Date().toDateString();
        const todayEntry = entries.find(e => e.type === 'daily' && new Date(e.date).toDateString() === todayStr);
        return todayEntry ? (
          <DailyEditor 
            entry={todayEntry} 
            updateEntry={updateEntry}
            onGenerateAI={handleAIInsight}
          />
        ) : <div className="p-10 text-center">Loading Today...</div>;
      
      case AppView.PAGES:
        return (
          <EntryListView 
            title="Pages" 
            icon={StickyNote} 
            entries={entries.filter(e => e.type === 'note' && !e.isArchived && !e.isDeleted && !e.tags?.includes('years-past') && !e.tags?.includes('days-past'))} 
            emptyMessage="No pages yet" 
            emptySubMessage="Create a one-off note to capture ideas, lists, or thoughts." 
            onNoteClick={setActiveEntryId} 
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            onCreateNote={handleCreateNote}
            selectionMode={selectionMode}
            selectedNotes={selectedNotes}
            onSelectNote={handleSelectNote}
          />
        );

      case AppView.EVERYTHING:
        return (
          <EntryListView 
            title="Everything" 
            icon={Layers} 
            entries={entries.filter(e => !e.isArchived && !e.isDeleted)} 
            emptyMessage="Nothing here yet" 
            emptySubMessage="Start writing in Today or create a new Page." 
            onNoteClick={setActiveEntryId} 
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            selectionMode={selectionMode}
            selectedNotes={selectedNotes}
            onSelectNote={handleSelectNote}
          />
        );

      case AppView.STARRED:
        return (
          <EntryListView 
            title="Starred" 
            icon={Star} 
            entries={entries.filter(e => e.isStarred && !e.isDeleted)} 
            emptyMessage="No starred notes" 
            emptySubMessage="Star important notes to keep them easily accessible here." 
            onNoteClick={setActiveEntryId} 
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            selectionMode={selectionMode}
            selectedNotes={selectedNotes}
            onSelectNote={handleSelectNote}
          />
        );

      case AppView.ARCHIVE:
        return (
          <EntryListView 
            title="Archive" 
            icon={ArchiveIcon} 
            entries={entries.filter(e => e.isArchived && !e.isDeleted)} 
            emptyMessage="Archive is empty" 
            emptySubMessage="Notes you archive will appear here." 
            onNoteClick={setActiveEntryId} 
            onToggleStar={handleToggleStar}
            onToggleArchive={handleToggleArchive}
            selectionMode={selectionMode}
            selectedNotes={selectedNotes}
            onSelectNote={handleSelectNote}
          />
        );

      case AppView.DELETED:
        return (
          <EntryListView 
            title="Deleted" 
            icon={Trash2} 
            entries={entries.filter(e => e.isDeleted)} 
            emptyMessage="Trash is empty" 
            emptySubMessage="Notes deleted are removed permanently after 30 days." 
            onNoteClick={setActiveEntryId} 
            onToggleStar={handleToggleStar}
            onDelete={handleDelete}
            selectionMode={selectionMode}
            selectedNotes={selectedNotes}
            onSelectNote={handleSelectNote}
          />
        );

      case AppView.TAGS:
        return (
          <TagsView 
            entries={entries} 
            onNoteClick={setActiveEntryId} 
            onToggleStar={handleToggleStar} 
            onToggleArchive={handleToggleArchive}
            selectionMode={selectionMode}
            selectedNotes={selectedNotes}
            onSelectNote={handleSelectNote}
          />
        );

      case AppView.REFLECTIONS:
        return (
          <ReflectionsView 
            entries={entries} 
            onNoteClick={setActiveEntryId} 
            onToggleStar={handleToggleStar} 
            onToggleArchive={handleToggleArchive}
            selectionMode={selectionMode}
            selectedNotes={selectedNotes}
            onSelectNote={handleSelectNote}
          />
        );

      case AppView.COMPLETED:
        return <CompletedTasksView todos={todos} setTodos={setTodos} />;

      case AppView.STATS:
        return <StatsView stats={stats} />;

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 capitalize">{currentView}</h2>
                <p>View not implemented in demo.</p>
            </div>
          </div>
        );
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && activeEntryId) {
      setActiveEntryId(null);
    }
  };

  const handleSetView = (view: AppView) => {
    setCurrentView(view);
    setActiveEntryId(null);
  };

  return (
    <div className="min-h-screen bg-journal-900 text-gray-200 font-sans overflow-hidden flex">
      <Sidebar 
        expanded={sidebarExpanded} 
        toggleExpanded={() => setSidebarExpanded(!sidebarExpanded)} 
        currentView={currentView}
        setView={handleSetView}
      />

      <div 
        className="flex-1 flex flex-col transition-all duration-300 relative h-screen overflow-hidden"
        style={{ marginLeft: sidebarExpanded ? '12rem' : '3rem' }}
      >
        <TopBar 
          searchQuery={searchQuery}
          onSearch={handleSearch} 
          lastBackup={new Date()} 
          stats={stats}
          selectionMode={selectionMode}
          onToggleSelectionMode={handleToggleSelectionMode}
          setView={handleSetView}
        />
        
        {/* Bulk Actions Toolbar */}
        {selectionMode && selectedNotes.size > 0 && (
          <div className="absolute top-16 left-0 right-0 bg-journal-800 border-b border-journal-600 px-6 py-3 flex items-center justify-between z-30 shadow-lg">
            <span className="font-semibold text-white">{selectedNotes.size} selected</span>
            <div className="flex items-center space-x-4 relative">
              {showBulkTagInput ? (
                <form onSubmit={handleBulkTagSubmit} className="flex items-center">
                  <input 
                    type="text" 
                    value={bulkTag}
                    onChange={(e) => setBulkTag(e.target.value)}
                    placeholder="Enter tag..."
                    className="bg-journal-900 border border-journal-600 rounded-l px-3 py-1 text-sm text-white outline-none focus:border-journal-accent"
                    autoFocus
                  />
                  <button type="submit" className="bg-journal-accent text-journal-900 px-3 py-1 rounded-r text-sm font-bold">Add</button>
                  <button type="button" onClick={() => setShowBulkTagInput(false)} className="ml-2 text-gray-400 hover:text-white"><X size={16}/></button>
                </form>
              ) : (
                <div className="group relative">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-journal-700">
                    <MoreVertical size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 delay-200 group-hover:delay-0 bg-journal-900 border border-journal-600 rounded-lg shadow-xl z-50 overflow-hidden w-48">
                    <button onClick={() => handleBulkAction('tag')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-journal-800 hover:text-white flex items-center transition-colors">
                      <Tag size={16} className="mr-3" /> Add Tag
                    </button>
                    <button onClick={() => handleBulkAction('archive')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-journal-800 hover:text-white flex items-center transition-colors">
                      <ArchiveIcon size={16} className="mr-3" /> Archive
                    </button>
                    <div className="h-px bg-journal-600 my-1"></div>
                    <button onClick={() => handleBulkAction('delete')} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 flex items-center transition-colors">
                      <Trash2 size={16} className="mr-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto ${selectionMode && selectedNotes.size > 0 ? 'mt-28' : 'mt-16'} px-4 md:px-8 pt-6 relative scroll-smooth transition-all`}>
          {renderContent()}
        </main>
      </div>

      <RightPanel />
      <BottomPanel todos={todos} setTodos={setTodos} />

      {/* AI Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
            <div className="bg-journal-800 rounded-xl shadow-2xl max-w-lg w-full border border-journal-600 p-6 relative">
                <button 
                    onClick={() => setAiModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={20}/>
                </button>

                <div className="flex items-center mb-4 text-purple-400">
                    <Sparkles className="mr-2" />
                    <h3 className="text-xl font-bold">Gemini Insights</h3>
                </div>

                {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="animate-spin text-journal-accent mb-4" size={32} />
                        <p className="text-sm text-gray-400">Analyzing your thoughts...</p>
                    </div>
                ) : aiContent ? (
                    <div className="space-y-4">
                        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                            <span className="text-xs uppercase tracking-wide text-purple-400 font-bold block mb-2">{aiContent.type}</span>
                            <p className="text-lg italic leading-relaxed">"{aiContent.content}"</p>
                        </div>
                        <div className="flex justify-end space-x-2">
                             <button className="px-4 py-2 bg-journal-700 hover:bg-journal-600 rounded text-sm transition-colors">Save to Note</button>
                             <button onClick={() => setAiModalOpen(false)} className="px-4 py-2 bg-journal-accent text-journal-900 font-bold rounded text-sm hover:opacity-90 transition-opacity">Done</button>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-400">Failed to generate insight.</p>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default App;