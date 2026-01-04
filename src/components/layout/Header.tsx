import { MessageSquare, Wand2 } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface HeaderProps {
  onOpenInbox: () => void;
  onToggleStudio?: () => void;
  isStudioMode?: boolean;
}

export const Header = ({ onOpenInbox, onToggleStudio, isStudioMode = false }: HeaderProps) => {
  // Check if user is signed in (not guest)
  const isSignedIn = typeof window !== 'undefined' && localStorage.getItem('vertikal_is_guest') !== 'true' && localStorage.getItem('vertikal_token');

  return (
    <div className="flex justify-between items-center px-4 py-4 sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 100 100"
            fill="none"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M25 40 L50 65 L75 25" />
            <path d="M75 25 L 55 25" />
            <path d="M75 25 L 75 45" />
          </svg>
        </div>
        <span className="font-black text-xl tracking-tighter">VERTIKAL</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Studio Toggle Button - Only show if signed in */}
        {isSignedIn && onToggleStudio && (
          <button
            onClick={() => {
              onToggleStudio();
              triggerHaptic('medium');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              isStudioMode
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'bg-[#1A1A1A] border-[#333] text-yellow-500'
            } flex items-center gap-1.5 active:scale-95`}
          >
            <Wand2 className="w-3 h-3" />
            <span>{isStudioMode ? 'STUDIO' : 'CREATOR'}</span>
          </button>
        )}
        <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] rounded-full px-3 py-1">
          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold">
            $
          </div>
          <span className="text-yellow-500 font-bold text-sm">150</span>
        </div>
        <button
          onClick={() => {
            onOpenInbox();
            triggerHaptic('light');
          }}
          className="relative active:scale-95 transition-transform"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-black"></div>
        </button>
      </div>
    </div>
  );
};


