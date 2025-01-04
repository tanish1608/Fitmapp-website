import React from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';

interface Message {
  username: string;
  message: string;
  time: string;
}

export function ChatPanel() {
  const messages: Message[] = [
    { username: 'Username', message: 'Message', time: '12:00 pm' },
    { username: 'Username', message: 'Message', time: '12:00 pm' },
    { username: 'Username', message: 'Message', time: '12:00 pm' },
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-lg h-full">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Chats
        </h3>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">{message.username}</span>
                <span className="text-gray-500 text-sm">{message.time}</span>
              </div>
              <p className="text-gray-400 truncate">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}