import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Sparkles, Image as ImageIcon, Star } from 'lucide-react';
import { JournalEntry, TimestampBlock } from '../types';
import { transcribeAudio } from '../services/geminiService';

interface DailyEditorProps {
  entry: JournalEntry;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onGenerateAI: (text: string) => void;
}

const DailyEditor: React.FC<DailyEditorProps> = ({ entry, updateEntry, onGenerateAI }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Focus the last block on mount if empty
  useEffect(() => {
    if (entry.blocks.length === 0) {
      addBlock();
    }
  }, []);

  const addBlock = (text: string = '', timeOverride?: string) => {
    const time = timeOverride || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newBlock: TimestampBlock = {
      id: Date.now().toString() + Math.random().toString(),
      time,
      text
    };
    updateEntry(entry.id, { blocks: [...entry.blocks, newBlock] });
  };

  const updateBlockText = (blockId: string, text: string) => {
    const newBlocks = entry.blocks.map(b => 
      b.id === blockId ? { ...b, text } : b
    );
    updateEntry(entry.id, { blocks: newBlocks });
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock();
      // Wait a tick for render then focus next input
      setTimeout(() => {
        const inputs = document.querySelectorAll('.journal-textarea');
        if (inputs[index + 1]) {
          (inputs[index + 1] as HTMLTextAreaElement).focus();
        }
      }, 0);
    } else if (e.key === 'Backspace' && entry.blocks[index].text === '' && index > 0) {
      e.preventDefault();
      const newBlocks = entry.blocks.filter((_, i) => i !== index);
      updateEntry(entry.id, { blocks: newBlocks });
      setTimeout(() => {
        const inputs = document.querySelectorAll('.journal-textarea');
        if (inputs[index - 1]) {
          (inputs[index - 1] as HTMLTextAreaElement).focus();
        }
      }, 0);
    }
  };

  // Voice Recording Logic
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setRecordingStatus('Transcribing...');
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        try {
          const text = await transcribeAudio(blob);
          addBlock(text);
          setRecordingStatus('');
        } catch (error) {
          setRecordingStatus('Error transcribing');
          console.error(error);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      setRecordingStatus('Mic Access Denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-40">
      {/* Header */}
      <div className="mb-8 border-b border-journal-600 pb-4">
        <h1 className="text-3xl font-bold text-white mb-1">{entry.formattedDate}</h1>
        <input 
          type="text" 
          value={entry.title}
          onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
          placeholder="Give today a title..."
          className="bg-transparent text-journal-700 text-lg w-full focus:outline-none focus:text-journal-accent transition-colors"
        />
      </div>

      {/* Toolbar */}
      <div className="sticky top-20 z-30 flex justify-end mb-4 space-x-2">
         <button 
           onClick={() => updateEntry(entry.id, { isStarred: !entry.isStarred } as any)}
           className="p-2 bg-journal-800 rounded-full text-gray-400 hover:text-yellow-400 transition-colors"
           title={entry.isStarred ? "Unstar" : "Star"}
         >
           <Star size={20} className={entry.isStarred ? 'fill-yellow-400 text-yellow-400' : ''} />
         </button>
         <button 
           onClick={() => onGenerateAI(entry.blocks.map(b => b.text).join('\n'))}
           className="p-2 bg-journal-800 rounded-full text-purple-400 hover:bg-purple-900/30 transition-colors"
           title="AI Insights"
         >
           <Sparkles size={20} />
         </button>
         <button className="p-2 bg-journal-800 rounded-full text-gray-400 hover:text-white transition-colors">
           <ImageIcon size={20} />
         </button>
         <button 
           onClick={toggleRecording}
           className={`p-2 rounded-full transition-colors flex items-center space-x-2 ${isRecording ? 'bg-red-500/20 text-red-500' : 'bg-journal-800 text-gray-400 hover:text-white'}`}
         >
           {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
           {isRecording && <span className="text-xs font-bold animate-pulse">REC</span>}
         </button>
      </div>

      {recordingStatus && (
        <div className="text-center text-xs text-journal-accent mb-4 animate-pulse">
          {recordingStatus}
        </div>
      )}

      {/* Editor Blocks */}
      <div className="space-y-1">
        {entry.blocks.map((block, index) => (
          <div key={block.id} className="group flex items-start md:-ml-16">
            {/* Timestamp Margin */}
            <div className="w-14 text-right pr-3 pt-1.5 text-xs text-gray-500 select-none font-mono opacity-50 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
              {block.time}
            </div>
            
            {/* Divider Line */}
            <div className="w-px bg-journal-600 self-stretch mr-4 relative">
               <div className="absolute top-2.5 -left-[3px] w-1.5 h-1.5 rounded-full bg-journal-600 group-focus-within:bg-journal-accent transition-colors"></div>
            </div>

            {/* Input Area */}
            <textarea
              className="journal-textarea flex-1 bg-transparent text-gray-200 resize-none outline-none leading-relaxed py-1 min-h-[2.5rem] overflow-hidden"
              value={block.text}
              placeholder="Start writing..."
              onChange={(e) => {
                updateBlockText(block.id, e.target.value);
                autoResizeTextarea(e);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              rows={1}
            />
          </div>
        ))}
        
        {/* Empty State click catcher */}
        {entry.blocks.length === 0 && (
          <div 
            className="h-32 flex items-center justify-center text-gray-600 cursor-text"
            onClick={() => addBlock()}
          >
            Click to start writing your day...
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyEditor;