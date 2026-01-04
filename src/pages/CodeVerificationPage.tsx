import { useState } from 'react';
import { motion } from 'framer-motion';
import { verifyCode, claimCode } from '../lib/mockVerification';
import { Loader2, Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { triggerHaptic } from '../utils/helpers';

interface CodeVerificationPageProps {
  email: string;
  onBack: () => void;
  onSuccess: (code: string) => void;
}

export const CodeVerificationPage = ({
  email,
  onBack,
  onSuccess,
}: CodeVerificationPageProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ type: 'invalid' | 'used' | 'generic'; message: string } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError({ type: 'generic', message: 'Please enter a verification code' });
      triggerHaptic('heavy');
      return;
    }

    setLoading(true);
    setError(null);
    triggerHaptic('light');

    const result = await verifyCode(code.trim());

    if (result.success) {
      // Claim code and trigger email
      await claimCode(code.trim(), email);
      triggerHaptic('heavy');
      onSuccess(code.trim().toUpperCase());
    } else {
      // Map error reasons to UI messages
      let errorMessage = 'Verification failed. Please try again.';
      let errorType: 'invalid' | 'used' | 'generic' = 'generic';

      if (result.message.includes('Invalid')) {
        errorMessage = 'Invalid or unrecognized code';
        errorType = 'invalid';
      } else if (result.message.includes('already been claimed') || result.message.includes('already')) {
        errorMessage = 'This code was already activated';
        errorType = 'used';
      }

      setError({ type: errorType, message: errorMessage });
      triggerHaptic('heavy');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      {/* VERTIKAL Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
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
        <span className="font-bold tracking-widest text-white">VERTIKAL</span>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="w-full max-w-md bg-[#0F172A] border border-gray-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-600/20 rounded-full blur-[50px] pointer-events-none"></div>

          <div className="relative z-10">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="mb-6 text-gray-400 hover:text-white text-sm flex items-center gap-2 transition"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {/* Icon */}
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/50">
              <Lock size={20} className="text-yellow-500" />
            </div>

            <h2 className="text-2xl font-black text-white mb-2">Founding 50 Access</h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter your unique 6–8 digit access code.
            </p>
            <p className="text-gray-500 text-xs mb-6">Email: {email}</p>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="F50-001 or FOUNDING_GENESIS"
                  value={code}
                  onChange={e =>
                    setCode(
                      e.target.value.toUpperCase().replace(/[^A-Z0-9\-_]/g, '').slice(0, 20)
                    )
                  }
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white font-mono text-center tracking-widest text-lg focus:border-yellow-500 outline-none transition uppercase"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-xl border-2 ${
                    error.type === 'used'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm font-bold">{error.message}</p>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Verify Access'
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

