import { X } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';
import type { Creator } from '../../utils/types';

interface SubscriptionModalProps {
  creator: Creator;
  onClose: () => void;
}

export const SubscriptionModal = ({ creator, onClose }: SubscriptionModalProps) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade">
      <div className="w-full max-w-md bg-[#111] rounded-t-3xl sm:rounded-3xl border border-gray-800 p-6 animate-spring-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Subscribe to {creator.company}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex gap-4 items-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black text-lg">
            V+
          </div>
          <div>
            <div className="font-bold text-yellow-400">Network Pass</div>
            <div className="text-xs text-gray-400">
              Access all {creator.stats.series} Series
            </div>
          </div>
        </div>
        <button
          className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl text-lg hover:bg-yellow-400 transition active:scale-95"
          onClick={() => {
            triggerHaptic('heavy');
            // TODO: Implement payment
          }}
        >
          Pay ${creator.subPrice}/mo
        </button>
        <p className="text-center text-[10px] text-gray-600 mt-4">Cancel anytime.</p>
      </div>
    </div>
  );
};


