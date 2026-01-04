import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface GuestModalProps {
  onClose: () => void;
  onLogin: () => void;
  onKeepBrowsing: () => void;
}

export const GuestModal = ({ onClose, onLogin, onKeepBrowsing }: GuestModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0F172A] border border-gray-800 rounded-2xl p-6 max-w-md w-full relative"
      >
        <button
          onClick={() => {
            onClose();
            triggerHaptic('light');
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-white mb-4">Guest Mode</h2>
        <p className="text-gray-300 mb-6">
          You can browse creators, networks, and public VIBEs without an account.
          Saving, posting, joining networks, and earning badges require signing in.
          You can upgrade at any time.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onLogin();
              triggerHaptic('medium');
            }}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition active:scale-95"
          >
            Log in / Sign up
          </button>
          <button
            onClick={() => {
              onKeepBrowsing();
              triggerHaptic('light');
            }}
            className="w-full bg-transparent border border-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-800/50 transition active:scale-95"
          >
            Keep Browsing
          </button>
        </div>
      </motion.div>
    </div>
  );
};

