import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../utils/helpers';
import { CodeVerificationPage } from './CodeVerificationPage';
import { ProfileSetupPage, type ProfileData } from './ProfileSetupPage';
import type { CompleteOnboardingData } from '../components/onboarding/OnboardingModal';

interface OnboardingPageProps {
  onComplete: (data: CompleteOnboardingData) => void;
  onGuestContinue?: () => void;
}

type OnboardingStep = 'email' | 'verification' | 'profile';

export const OnboardingPage = ({ onComplete, onGuestContinue }: OnboardingPageProps) => {
  const [step, setStep] = useState<OnboardingStep>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleGuestContinue = () => {
    triggerHaptic('medium');
    localStorage.setItem('vertikal_is_guest', 'true');
    onGuestContinue?.();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      triggerHaptic('heavy');
      return;
    }
    triggerHaptic('medium');
    setStep('verification');
  };

  const handleVerificationSuccess = (code: string) => {
    setVerificationCode(code);
    setStep('profile');
  };

  const handleProfileComplete = (profileData: ProfileData) => {
    // Map ProfileData to CompleteOnboardingData format
    // Note: We're preserving the full profile data structure
    const completeData: CompleteOnboardingData = {
      email,
      verificationCode,
      profile: {
        stageName: profileData.name,
        primaryRole: 'Director', // Default, can be updated later
        // Store additional profile data for future use
        ...(profileData as any),
      },
    };
    onComplete(completeData);
  };

  // Step 2: Code Verification
  if (step === 'verification') {
    return (
      <CodeVerificationPage
        email={email}
        onBack={() => setStep('email')}
        onSuccess={handleVerificationSuccess}
      />
    );
  }

  // Step 3: Profile Setup
  if (step === 'profile') {
    return (
      <ProfileSetupPage
        email={email}
        verificationCode={verificationCode}
        onComplete={handleProfileComplete}
      />
    );
  }

  // Step 1: Email Entry
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

      {/* Email Entry Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="w-full max-w-md bg-[#0F172A] border border-gray-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-700">
              <span className="text-xl">📧</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Identify Yourself</h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter your email to verify eligibility.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="director@studio.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition"
                autoFocus
                required
              />
              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition active:scale-95"
              >
                Continue <ArrowRight size={18} />
              </button>
            </form>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="w-full bg-transparent border border-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-800/50 transition active:scale-95"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
