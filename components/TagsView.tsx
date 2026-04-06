import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { NoteCard } from './NoteCard';
import { Tag, ChevronLeft, Plus } from 'lucide-react';

interface TagsViewProps {
  entries: JournalEntry[];
  onNoteClick: (id: string) => void;
  onToggleStar: (id: string, current: boolean) => void;
  onToggleArchive?: (id: string, current: boolean) => void;
  selectionMode?: boolean;
  selectedNotes?: Set<string>;
  onSelectNote?: (id: string) => void;
}

export const TagsView: React.FC<TagsViewProps> = ({ 
  entries, onNoteClick, onToggleStar, onToggleArchive,
  selectionMode, selectedNotes, onSelectNote
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [createdTags, setCreatedTags] = useState<string[]>([]);

  // Sort tags alphabetically
  const allTags = Array.from(new Set([...entries.flatMap(e => e.tags || []), ...createdTags])).sort((a, b) => a.localeCompare(b));

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !allTags.includes(newTagInput.trim())) {
      setCreatedTags([...createdTags, newTagInput.trim()]);
    }
    setNewTagInput('');
  };

  if (selectedTag) {
    const filteredEntries = entries.filter(e => e.tags?.includes(selectedTag) && !e.isDeleted);
    return (
      <div className="p-8 pb-32">
        <div className="flex items-start justify-between mb-8 w-full gap-4">
          <div className="flex items-center w-2/3">
            <button 
              onClick={() => setSelectedTag(null)}
              className="mr-4 p-2 hover:bg-journal-800 rounded-full text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-3xl font-bold text-white flex items-center truncate">
              <Tag className="mr-3 text-journal-accent shrink-0" size={28} />
              <span className="truncate">{selectedTag}</span>
            </h2>
          </div>
          <div className="w-1/3 text-xs md:text-sm text-gray-500 italic hidden md:block leading-tight line-clamp-2">
            to add a tag to multiple notes, click the selection button to select them and use the 3 dots to choose which tags to add
          </div>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredEntries.map(entry => (
            <NoteCard 
              key={entry.id} 
              note={entry} 
              onClick={() => onNoteClick(entry.id)} 
              onToggleStar={(e) => {
                e.stopPropagation();
                onToggleStar(entry.id, !!entry.isStarred);
              }}
              onToggleArchive={onToggleArchive ? (e) => {
                e.stopPropagation();
                onToggleArchive(entry.id, !!entry.isArchived);
              } : undefined}
              selectionMode={selectionMode}
              isSelected={selectedNotes?.has(entry.id)}
              onSelect={(e) => {
                e.stopPropagation();
                if (onSelectNote) onSelectNote(entry.id);
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Tag className="mr-3 text-journal-accent" size={28} />
          Tags
        </h2>
        <div className="relative flex items-center">
          <form onSubmit={handleAddTag} className="flex items-center w-full max-w-xs">
            <input 
              type="text" 
              placeholder="Add a tag..." 
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="bg-journal-900 border border-journal-600 rounded-l px-3 py-2 text-white outline-none focus:border-journal-accent w-full"
            />
            <button type="submit" className="bg-journal-accent text-journal-900 px-3 py-2 rounded-r font-bold hover:opacity-90 shrink-0">
              <Plus size={20} />
            </button>
          </form>
          {/* Suggestions dropdown */}
          {newTagInput && (
            <div className="absolute top-full left-0 right-10 mt-1 bg-journal-800 border border-journal-600 rounded shadow-xl z-10 max-h-48 overflow-y-auto">
              {allTags.filter(t => t.toLowerCase().includes(newTagInput.toLowerCase())).map(t => (
                <div 
                  key={t} 
                  className="px-3 py-2 hover:bg-journal-700 cursor-pointer text-sm text-gray-200" 
                  onClick={() => setNewTagInput(t)}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {allTags.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-journal-600 rounded-xl">
          <Tag size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No tags yet</p>
          <p className="text-sm">Add tags to your notes to organize them here.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {allTags.map(tag => {
            const count = entries.filter(e => e.tags?.includes(tag) && !e.isDeleted).length;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className="bg-journal-800 hover:bg-journal-700 border border-journal-600 hover:border-journal-accent text-white px-6 py-4 rounded-xl flex items-center justify-between min-w-[200px] transition-all"
              >
                <span className="flex items-center font-medium">
                  <Tag size={18} className="mr-2 text-journal-accent" />
                  {tag}
                </span>
                <span className="bg-journal-900 text-gray-400 text-xs px-2 py-1 rounded-full">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
