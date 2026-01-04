import { ChevronLeft, Phone, PlusCircle, Send } from 'lucide-react';
import type { Creator } from '../../utils/types';

interface ChatViewProps {
  userId: string;
  creators: Record<string, Creator>;
  onClose: () => void;
}

export const ChatView = ({ userId, creators, onClose }: ChatViewProps) => {
  const user = creators[userId] || { name: 'User', avatar: '' };

  return (
    <div className="fixed inset-0 z-[70] bg-black animate-fade flex flex-col">
      <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <button onClick={onClose}>
          <ChevronLeft className="text-white w-6 h-6" />
        </button>
        <img
          src={user.avatar}
          className="w-8 h-8 rounded-full object-cover"
          alt={user.name}
        />
        <span className="font-bold text-sm">{user.name}</span>
        <div className="ml-auto text-blue-500">
          <Phone className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="flex justify-start">
          <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-gray-200 animate-pop">
            Hey! Saw the new posting.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm text-white animate-pop">
            Yeah! Are you available next week?
          </div>
        </div>
      </div>
      <div className="p-3 border-t border-gray-800 flex gap-2 items-center bg-black pb-8">
        <button className="text-gray-500">
          <PlusCircle className="w-6 h-6" />
        </button>
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 bg-gray-900 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button className="text-blue-500 font-bold p-2">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


