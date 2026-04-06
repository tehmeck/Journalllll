import React from 'react';
import { JournalEntry } from '../types';
import { NoteCard } from './NoteCard';
import { History } from 'lucide-react';

interface ReflectionsViewProps {
  entries: JournalEntry[];
  onNoteClick: (id: string) => void;
  onToggleStar: (id: string, current: boolean) => void;
  onToggleArchive?: (id: string, current: boolean) => void;
  selectionMode?: boolean;
  selectedNotes?: Set<string>;
  onSelectNote?: (id: string) => void;
}

export const ReflectionsView: React.FC<ReflectionsViewProps> = ({
  entries, onNoteClick, onToggleStar, onToggleArchive,
  selectionMode, selectedNotes, onSelectNote
}) => {
  // In a real app, we would filter actual entries based on date.
  // For the demo, we'll just display the entries passed in, assuming they are the mock reflections.

  const yearsPast = entries.filter(e => e.tags?.includes('years-past'));
  const daysPast = entries.filter(e => e.tags?.includes('days-past'));

  return (
    <div className="p-8 pb-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white flex items-center mb-6">
          <History className="mr-3 text-journal-accent" size={28} />
          Reflections
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Look back at what you wrote on this exact date in previous years. It shows both the daily note and any other notes you made on this day, but in years past.
        </p>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {yearsPast.map(entry => (
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

      <div className="mt-16">
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-journal-600 pb-2">
          Recent Milestones
        </h3>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {daysPast.map(entry => (
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
    </div>
  );
};
