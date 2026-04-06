import React from 'react';
import { JournalEntry } from '../types';
import { Star, Archive, CheckCircle2, Circle } from 'lucide-react';

interface NoteCardProps {
  note: JournalEntry;
  onClick: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
  onToggleArchive?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, onClick, onToggleStar, onToggleArchive, onDelete,
  selectionMode, isSelected, onSelect 
}) => {
  return (
    <div 
      onClick={selectionMode ? onSelect : onClick}
      className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col relative break-inside-avoid mb-6 group
        ${note.color || 'bg-journal-800'}
        ${isSelected ? 'border-journal-accent ring-2 ring-journal-accent/50' : 'border-journal-600 hover:border-journal-accent'}
      `}
    >
      {/* Selection Checkmark */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect) onSelect(e);
        }}
        className={`absolute top-5 left-5 z-20 transition-opacity
          ${isSelected || selectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        {isSelected ? (
          <CheckCircle2 size={20} className="text-journal-accent fill-journal-900" />
        ) : (
          <Circle size={20} className="text-gray-400 hover:text-white" />
        )}
      </div>

      <div className="absolute top-4 right-4 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleArchive && (
          <button 
            onClick={onToggleArchive}
            className="text-gray-400 hover:text-white"
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            <Archive size={18} className={note.isArchived ? 'text-journal-accent' : ''} />
          </button>
        )}
        <button 
          onClick={onToggleStar}
          className="text-gray-400 hover:text-yellow-400"
          title={note.isStarred ? "Unstar" : "Star"}
        >
          <Star size={18} className={note.isStarred ? 'fill-yellow-400 text-yellow-400' : ''} />
        </button>
      </div>
      
      {/* Ensure title doesn't overlap with absolute icons */}
      <h3 className="font-bold text-xl text-white mb-2 pr-16">
        {note.title || (note.type === 'daily' ? note.formattedDate : 'Untitled Note')}
      </h3>
      <div className="text-xs text-gray-400 mb-3">{note.formattedDate}</div>
      
      <p className="text-sm text-gray-300 whitespace-pre-wrap">
        {note.blocks.map(b => b.text).join('\n') || 'Empty note...'}
      </p>
      
      {note.tags && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-journal-900/50 text-journal-accent px-2 py-0.5 rounded text-[10px] border border-journal-600/50">
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-gray-500 px-1">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Deleted Note Actions */}
      {note.isDeleted && onDelete && (
        <div className="mt-4 pt-4 border-t border-journal-600/50 flex justify-end">
          <button 
            onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-300 font-semibold"
          >
            Delete Permanently
          </button>
        </div>
      )}
    </div>
  );
};
