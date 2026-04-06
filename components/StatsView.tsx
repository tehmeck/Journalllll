import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { UserStats } from '../types';

interface StatsViewProps {
  stats: UserStats;
}

const data = [
  { name: 'Mon', words: 400 },
  { name: 'Tue', words: 300 },
  { name: 'Wed', words: 600 },
  { name: 'Thu', words: 200 },
  { name: 'Fri', words: 800 },
  { name: 'Sat', words: 150 },
  { name: 'Sun', words: 450 },
];

const StatsView: React.FC<StatsViewProps> = ({ stats }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Your Journey</h2>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-journal-800 p-6 rounded-lg border border-journal-600">
          <div className="text-gray-400 text-sm mb-1">Total Words</div>
          <div className="text-4xl font-bold text-journal-accent">{stats.wordsTyped.toLocaleString()}</div>
        </div>
        <div className="bg-journal-800 p-6 rounded-lg border border-journal-600">
          <div className="text-gray-400 text-sm mb-1">Current Streak</div>
          <div className="text-4xl font-bold text-green-400">{stats.streakDays} Days</div>
        </div>
        <div className="bg-journal-800 p-6 rounded-lg border border-journal-600">
          <div className="text-gray-400 text-sm mb-1">Pages Written</div>
          <div className="text-4xl font-bold text-yellow-400">{stats.pagesWritten}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <div className="bg-journal-800 p-6 rounded-lg border border-journal-600 h-80">
          <h3 className="text-lg font-semibold text-white mb-4">Words this Week</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ bottom: 20 }}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#202124', borderColor: '#3c4043', color: '#fff' }}
              />
              <Bar dataKey="words" fill="#8ab4f8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 */}
        <div className="bg-journal-800 p-6 rounded-lg border border-journal-600 h-80">
          <h3 className="text-lg font-semibold text-white mb-4">Sentiment Flow</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ bottom: 20 }}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis hide />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#202124', borderColor: '#3c4043', color: '#fff' }}
              />
              <Line type="monotone" dataKey="words" stroke="#f28b82" strokeWidth={2} dot={{ fill: '#f28b82' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pb-10">
         <div className="bg-journal-800/50 p-4 rounded border border-journal-600">
             <div className="text-xs text-gray-400">Unique Words</div>
             <div className="text-xl font-mono text-white">{stats.uniqueWords}</div>
         </div>
         <div className="bg-journal-800/50 p-4 rounded border border-journal-600">
             <div className="text-xs text-gray-400">Tasks Done</div>
             <div className="text-xl font-mono text-white">{stats.tasksAccomplished}</div>
         </div>
         <div className="bg-journal-800/50 p-4 rounded border border-journal-600">
             <div className="text-xs text-gray-400">Avg Page Length</div>
             <div className="text-xl font-mono text-white">450 words</div>
         </div>
         <div className="bg-journal-800/50 p-4 rounded border border-journal-600">
             <div className="text-xs text-gray-400">Searches</div>
             <div className="text-xl font-mono text-white">{stats.searchesMade}</div>
         </div>
      </div>
    </div>
  );
};

export default StatsView;