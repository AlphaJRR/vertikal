import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyCode, claimCode } from '../../lib/mockVerification';
import { Loader2, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface OnboardingModalProps {
  onClose: () => void;
  onComplete: (data: CompleteOnboardingData) => void;
}

export interface CompleteOnboardingData {
  email: string;
  verificationCode: string;
  profile: {
    stageName: string;
    primaryRole: string;
  };
}

type Step = 'email' | 'code' | 'profile';

const slideUpVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
      duration: 0.5,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const OnboardingModal = ({ onClose, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [stageName, setStageName] = useState('');
  const [primaryRole, setPrimaryRole] = useState('Director');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // STEP 1: HANDLE EMAIL
  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      triggerHaptic('heavy');
      return;
    }
    setError('');
    triggerHaptic('medium');
    setStep('code');
  };

  // STEP 2: VERIFY CODE
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    triggerHaptic('light');

    const result = await verifyCode(code);

    if (result.success) {
      await claimCode(code, email); // Log email trigger
      triggerHaptic('heavy');
      setStep('profile');
    } else {
      setError(result.message);
      triggerHaptic('heavy');
    }
    setLoading(false);
  };

  // STEP 3: CREATE PROFILE
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName.trim()) {
      setError('Please enter your stage name.');
      triggerHaptic('heavy');
      return;
    }
    setLoading(true);
    triggerHaptic('medium');

    setTimeout(() => {
      const completeData: CompleteOnboardingData = {
        email,
        verificationCode: code,
        profile: {
          stageName: stageName.trim(),
          primaryRole,
        },
      };
      triggerHaptic('heavy');
      onComplete(completeData);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center">
        <motion.div
          className="w-full max-w-md bg-[#0F172A] border border-gray-800 rounded-2xl sm:rounded-2xl p-8 shadow-2xl overflow-hidden relative"
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px] pointer-events-none"></div>

          <AnimatePresence mode="wait">
            {/* --- STEP 1: EMAIL --- */}
            {step === 'email' && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-700">
                  <span className="text-xl">📧</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Identify Yourself</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Enter your email to verify eligibility.
                </p>
                <form onSubmit={handleEmail} className="space-y-4">
                  <input
                    type="email"
                    placeholder="director@studio.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition"
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition active:scale-95"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </form>
              </motion.div>
            )}

            {/* --- STEP 2: CODE ENTRY --- */}
            {step === 'code' && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10"
              >
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/50">
                  <Lock size={20} className="text-yellow-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Founding 50 Access</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Enter your unique access code.
                </p>
                <form onSubmit={handleVerification} className="space-y-4">
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
                  />
                  {error && (
                    <p className="text-red-500 text-xs text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      'Verify Access'
                    )}
                  </button>
                </form>
                <button
                  onClick={() => {
                    setStep('email');
                    setError('');
                    triggerHaptic('light');
                  }}
                  className="w-full text-center text-gray-500 text-xs mt-4 hover:text-white transition"
                >
                  Go Back
                </button>
              </motion.div>
            )}

            {/* --- STEP 3: PROFILE SETUP --- */}
            {step === 'profile' && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50 mx-auto">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Access Granted</h2>
                <p className="text-gray-400 text-sm mb-8">Welcome to the Founding 50.</p>

                <form onSubmit={handleProfileSave} className="space-y-4 text-left">
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">
                      Stage Name
                    </label>
                    <input
                      type="text"
                      value={stageName}
                      onChange={e => setStageName(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition"
                      placeholder="e.g. J.R.R. Roberts"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">
                      Primary Role
                    </label>
                    <select
                      value={primaryRole}
                      onChange={e => setPrimaryRole(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition"
                    >
                      <option>Director</option>
                      <option>Producer</option>
                      <option>Cinematographer</option>
                      <option>Writer</option>
                      <option>Editor</option>
                      <option>Creator</option>
                    </select>
                  </div>
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {loading ? 'Building Studio...' : 'Enter Vertikal'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
