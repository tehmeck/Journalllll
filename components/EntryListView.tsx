import React from 'react';
import { JournalEntry } from '../types';
import { NoteCard } from './NoteCard';
import { Plus } from 'lucide-react';

interface EntryListViewProps {
  title: string;
  icon: React.ElementType;
  entries: JournalEntry[];
  emptyMessage: string;
  emptySubMessage: string;
  onNoteClick: (id: string) => void;
  onToggleStar: (id: string, current: boolean) => void;
  onToggleArchive?: (id: string, current: boolean) => void;
  onDelete?: (id: string) => void;
  onCreateNote?: () => void;
  selectionMode?: boolean;
  selectedNotes?: Set<string>;
  onSelectNote?: (id: string) => void;
}

export const EntryListView: React.FC<EntryListViewProps> = ({ 
  title, icon: Icon, entries, emptyMessage, emptySubMessage, 
  onNoteClick, onToggleStar, onToggleArchive, onDelete, onCreateNote,
  selectionMode, selectedNotes, onSelectNote
}) => {
  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Icon className="mr-3 text-journal-accent" size={28} />
          {title}
        </h2>
        {onCreateNote && (
          <button 
            onClick={onCreateNote}
            className="flex items-center bg-journal-accent text-journal-900 px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={20} className="mr-2" /> New Note
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-journal-600 rounded-xl">
          <Icon size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">{emptyMessage}</p>
          <p className="text-sm">{emptySubMessage}</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {entries.map(entry => (
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
              onDelete={onDelete ? (e) => {
                e.stopPropagation();
                onDelete(entry.id);
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
      )}
    </div>
  );
};
