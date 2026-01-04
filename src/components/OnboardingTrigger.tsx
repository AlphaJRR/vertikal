import { UserPlus } from 'lucide-react';
import { triggerHaptic } from '../utils/helpers';

interface OnboardingTriggerProps {
  onOpen: () => void;
  variant?: 'button' | 'link';
  className?: string;
}

/**
 * Component to trigger the onboarding modal
 * Can be used as a button or link throughout the app
 */
export const OnboardingTrigger = ({
  onOpen,
  variant = 'button',
  className = '',
}: OnboardingTriggerProps) => {
  const handleClick = () => {
    onOpen();
    triggerHaptic('medium');
  };

  if (variant === 'link') {
    return (
      <button
        onClick={handleClick}
        className={`text-blue-500 hover:text-blue-400 font-bold transition-colors ${className}`}
      >
        Become a Creator
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all active:scale-95 ${className}`}
    >
      <UserPlus className="w-5 h-5" />
      Become a Creator
    </button>
  );
};


