import { ChevronLeft } from 'lucide-react';
import type { Chat } from '../../utils/types';
import type { Creator } from '../../utils/types';

interface InboxViewProps {
  chats: Chat[];
  creators: Record<string, Creator>;
  onClose: () => void;
  onOpenChat: (userId: string) => void;
}

export const InboxView = ({ chats, creators, onClose, onOpenChat }: InboxViewProps) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black animate-fade flex flex-col">
      <div className="h-14 flex items-center gap-4 px-4 border-b border-gray-800">
        <button onClick={onClose}>
          <ChevronLeft className="text-white w-6 h-6" />
        </button>
        <span className="font-bold text-lg">Direct Messages</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map(chat => {
          const user = creators[chat.userId] || { name: 'User', avatar: '' };
          return (
            <div
              key={chat.id}
              onClick={() => onOpenChat(chat.userId)}
              className="flex items-center gap-4 p-2 active:bg-gray-900 rounded-lg transition active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={user.name}
                />
                {chat.unread && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border border-black"></div>
                )}
              </div>
              <div className="flex-1 border-b border-gray-800 pb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm">{user.name}</span>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p
                  className={`text-sm truncate ${
                    chat.unread ? 'text-white font-bold' : 'text-gray-400'
                  }`}
                >
                  {chat.lastMsg}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


