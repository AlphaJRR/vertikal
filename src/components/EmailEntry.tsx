import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../utils/helpers';

interface EmailEntryProps {
  onEmailSubmit: (email: string) => void;
}

export const EmailEntry = ({ onEmailSubmit }: EmailEntryProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      triggerHaptic('heavy');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      triggerHaptic('heavy');
      return;
    }

    triggerHaptic('medium');
    onEmailSubmit(email.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Enter Your Email</h3>
        <p className="text-gray-400 text-sm">
          We&apos;ll use this to verify your Founding 50 access
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="your@email.com"
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm animate-pop">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full brand-gradient py-4 rounded-lg font-bold text-white shadow-lg shadow-purple-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </motion.div>
  );
};


