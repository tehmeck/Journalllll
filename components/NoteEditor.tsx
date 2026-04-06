import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { Palette, Tag, Archive, Trash2, Share2, X, ChevronLeft, Star } from 'lucide-react';

interface NoteEditorProps {
  note: JournalEntry;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onBack: () => void;
  allTags: string[];
}

const COLORS = [
  'bg-journal-800',
  'bg-red-900/40',
  'bg-blue-900/40',
  'bg-green-900/40',
  'bg-yellow-900/40',
  'bg-purple-900/40',
  'bg-pink-900/40',
];

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, updateEntry, onBack, allTags }) => {
  const [tagInput, setTagInput] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const filteredTags = allTags ? allTags.filter(t => t.toLowerCase().startsWith(tagInput.toLowerCase()) && !note.tags.includes(t)) : [];

  const handleShare = async () => {
    const text = `${note.title}\n\n${note.blocks.map(b => b.text).join('\n')}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: note.title, text });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Note copied to clipboard!');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag: string) => {
    if (!note.tags.includes(tag)) {
      updateEntry(note.id, { tags: [...note.tags, tag] });
    }
    setTagInput('');
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateEntry(note.id, { tags: note.tags.filter(t => t !== tagToRemove) });
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-40">
      <div className="mb-6 flex items-center justify-between border-b border-journal-600 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" /> Back
        </button>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => updateEntry(note.id, { isStarred: !note.isStarred })}
            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors rounded-full hover:bg-journal-800"
            title={note.isStarred ? "Unstar" : "Star"}
          >
            <Star size={18} className={note.isStarred ? 'fill-yellow-400 text-yellow-400' : ''} />
          </button>

          <div className="group relative">
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-journal-800">
              <Palette size={18} />
            </button>
            <div className="absolute right-0 mt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 flex transition-all duration-200 delay-200 group-hover:delay-0 bg-journal-800 border border-journal-600 rounded-lg p-2 space-x-2 z-50 shadow-xl">
              {COLORS.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${color} border border-journal-600 hover:scale-110 transition-transform`}
                  onClick={() => updateEntry(note.id, { color })}
                />
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-journal-800"
            title="Share"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={() => {
              updateEntry(note.id, { isArchived: !note.isArchived });
              onBack();
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-journal-800"
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            <Archive size={18} className={note.isArchived ? 'text-journal-accent' : ''} />
          </button>
          <button 
            onClick={() => {
              updateEntry(note.id, { isDeleted: true });
              onBack();
            }}
            className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-red-900/30"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className={`p-6 rounded-xl border border-journal-600 ${note.color || 'bg-journal-800'} transition-colors duration-300`}>
        <input 
          type="text" 
          value={note.title}
          onChange={(e) => updateEntry(note.id, { title: e.target.value })}
          placeholder="Note Title"
          className="bg-transparent text-3xl font-bold text-white mb-2 w-full focus:outline-none placeholder-gray-500"
        />
        <div className="text-sm text-gray-400 mb-6 flex items-center space-x-4">
          <span>{note.formattedDate} at {note.blocks[0]?.time}</span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 items-center relative">
          {note.tags.map(tag => (
            <span key={tag} className="bg-journal-900 text-journal-accent px-2 py-1 rounded-md text-xs flex items-center border border-journal-600">
              <Tag size={10} className="mr-1" /> {tag}
              <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-white"><X size={12} /></button>
            </span>
          ))}
          <div className="relative">
            <input 
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowTagDropdown(true);
              }}
              onFocus={() => setShowTagDropdown(true)}
              onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
              onKeyDown={handleAddTag}
              placeholder="Add tag..."
              className="bg-transparent border-b border-journal-600 text-sm focus:outline-none focus:border-journal-accent text-gray-300 w-24"
            />
            {showTagDropdown && tagInput.trim() && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-journal-900 border border-journal-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-journal-accent hover:bg-journal-800 transition-colors"
                  onClick={() => addTag(tagInput.trim())}
                >
                  Add "{tagInput.trim()}"
                </button>
                {filteredTags.map(tag => (
                  <button
                    key={tag}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-journal-800 hover:text-white transition-colors"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <textarea
          className="w-full bg-transparent text-gray-200 resize-none outline-none leading-relaxed min-h-[300px]"
          value={note.blocks[0]?.text || ''}
          placeholder="Start typing your note..."
          onChange={(e) => {
            const newBlocks = [...note.blocks];
            if (newBlocks.length === 0) {
              newBlocks.push({ id: Date.now().toString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: e.target.value });
            } else {
              newBlocks[0] = { ...newBlocks[0], text: e.target.value };
            }
            updateEntry(note.id, { blocks: newBlocks });
          }}
        />
      </div>
    </div>
  );
};
