import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface ApplyFormModalProps {
  job: {
    title: string;
    proj: string;
    rate: string;
    type: string;
  };
  onClose: () => void;
  onSubmit?: (data: { name: string; email: string; message?: string }) => Promise<void>;
}

export const ApplyFormModal = ({ job, onClose, onSubmit }: ApplyFormModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      triggerHaptic('heavy');
      return;
    }

    setLoading(true);
    triggerHaptic('medium');

    try {
      // Call onSubmit if provided, otherwise simulate
      if (onSubmit) {
        await onSubmit({ name: name.trim(), email: email.trim(), message: message.trim() });
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In production, this would call Supabase/Zapier
        console.log('[MOCK] Application submitted:', { job, name, email, message });
      }

      setSuccess(true);
      triggerHaptic('heavy');
      
      // Keep form data visible, don't clear
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
      setLoading(false);
      triggerHaptic('heavy');
    }
  };

  const slideUpVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
        <motion.div
          className="w-full max-w-md bg-[#0F172A] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-800 max-h-[90vh] overflow-y-auto"
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Apply for {job.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              <X size={20} />
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Application received</h3>
              <p className="text-gray-400 mb-4">Check your email</p>
              <div className="bg-gray-900/50 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-300 mb-1"><strong>Name:</strong> {name}</p>
                <p className="text-sm text-gray-300"><strong>Email:</strong> {email}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Your name"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="your@email.com"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us why you're interested..."
                  rows={4}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition resize-none"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

