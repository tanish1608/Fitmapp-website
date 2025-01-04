import React, { useState } from 'react';
import { MessageSquare, X, Search, Plus, MoreVertical } from 'lucide-react';
import { ChatPanel } from './ChatPanel';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-[600px] bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
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
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          <ChatPanel />
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    </>
  );
}