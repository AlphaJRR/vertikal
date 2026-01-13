import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';
import { validateFounding50InviteCode } from '../../services/firebase/inviteCodeService';

interface OnboardingModalProps {
  onClose: () => void;
  onComplete: (data: CreatorOnboardingData) => void;
}

export interface CreatorOnboardingData {
  name: string;
  role: string;
  company?: string;
  bio: string;
  avatar?: string;
  inviteCode?: string;
  isFounding50: boolean;
}

type Step = 'invite' | 'profile' | 'complete';

export const OnboardingModal = ({ onClose, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState<Step>('invite');
  const [inviteCode, setInviteCode] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const [codeError, setCodeError] = useState<string>('');
  const [isFounding50, setIsFounding50] = useState(false);
  const [skippedInvite, setSkippedInvite] = useState(false);

  // Profile form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleValidateCode = async () => {
    if (!inviteCode.trim()) {
      setCodeError('Please enter an invite code');
      return;
    }

    setValidatingCode(true);
    setCodeError('');
    setCodeValid(null);

    try {
      const result = await validateFounding50InviteCode(inviteCode.trim().toUpperCase());
      
      if (result.valid) {
        setCodeValid(true);
        setIsFounding50(true);
        triggerHaptic('medium');
        // Auto-advance to profile step after short delay
        setTimeout(() => {
          setStep('profile');
          triggerHaptic('light');
        }, 1000);
      } else {
        setCodeValid(false);
        setCodeError(result.reason || 'Invalid invite code');
        triggerHaptic('heavy');
      }
    } catch (error) {
      setCodeValid(false);
      setCodeError('Failed to validate code. Please try again.');
      triggerHaptic('heavy');
    } finally {
      setValidatingCode(false);
    }
  };

  const handleSkipInvite = () => {
    setSkippedInvite(true);
    setIsFounding50(false);
    setStep('profile');
    triggerHaptic('light');
  };

  const handleSubmitProfile = async () => {
    if (!name.trim() || !role.trim() || !bio.trim()) {
      triggerHaptic('heavy');
      return;
    }

    const onboardingData: CreatorOnboardingData = {
      name: name.trim(),
      role: role.trim(),
      company: company.trim() || undefined,
      bio: bio.trim(),
      avatar: avatar.trim() || undefined,
      inviteCode: inviteCode.trim() || undefined,
      isFounding50,
    };

    triggerHaptic('heavy');
    
    // TODO: Send to Zapier webhook for email notification
    // const zapierWebhookUrl = process.env.REACT_APP_ZAPIER_WEBHOOK_URL;
    // if (zapierWebhookUrl) {
    //   fetch(zapierWebhookUrl, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ type: 'creator_application', data: onboardingData })
    //   }).catch(console.error);
    // }
    
    // TODO: Send email notification to owner
    // await sendCreatorApplicationEmail(onboardingData);
    
    setStep('complete');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade">
      <div className="w-full max-w-md bg-[#111] rounded-t-3xl sm:rounded-3xl border border-gray-800 p-6 animate-spring-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {step === 'invite' && 'Join VERTIKAL'}
            {step === 'profile' && 'Create Your Profile'}
            {step === 'complete' && 'Welcome!'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Invite Code Step */}
        {step === 'invite' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-purple-400">Founding 50 Program</h3>
              </div>
              <p className="text-sm text-gray-300">
                Have an invite code? Enter it below to unlock exclusive Founding 50 benefits,
                including special badges and early access features.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">
                Invite Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={e => {
                    setInviteCode(e.target.value.toUpperCase());
                    setCodeValid(null);
                    setCodeError('');
                  }}
                  placeholder="Enter code (e.g., V50-XXXX)"
                  className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 uppercase"
                  disabled={validatingCode}
                />
                <button
                  onClick={handleValidateCode}
                  disabled={validatingCode || !inviteCode.trim()}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors active:scale-95 flex items-center gap-2"
                >
                  {validatingCode ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Validating...</span>
                    </>
                  ) : (
                    'Validate'
                  )}
                </button>
              </div>

              {/* Validation Status */}
              {codeValid === true && (
                <div className="flex items-center gap-2 text-green-400 text-sm animate-pop">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold">Valid Founding 50 code! 🎉</span>
                </div>
              )}

              {codeValid === false && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-pop">
                  <AlertCircle className="w-5 h-5" />
                  <span>{codeError || 'Invalid code'}</span>
                </div>
              )}

              {isFounding50 && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-sm text-purple-300">
                  <div className="font-bold mb-1">Founding 50 Benefits Unlocked:</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Exclusive Founding 50 badge</li>
                    <li>Early access to new features</li>
                    <li>Priority support</li>
                    <li>Special creator perks</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkipInvite}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors active:scale-95"
              >
                Skip for Now
              </button>
            </div>
          </div>
        )}

        {/* Complete/Thank You Step */}
        {step === 'complete' && (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50">
              <CheckCircle className="text-green-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to VERTIKAL!</h3>
            <p className="text-gray-400 mb-6">
              Your profile has been created successfully. {isFounding50 && 'Your Founding 50 status is active!'}
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm text-gray-300"><strong>Name:</strong> {name}</p>
              <p className="text-sm text-gray-300"><strong>Role:</strong> {role}</p>
              {company && <p className="text-sm text-gray-300"><strong>Company:</strong> {company}</p>}
              {isFounding50 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-purple-400 font-bold">✨ Founding 50 Member</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Next Steps:</p>
              <ul className="text-sm text-gray-400 space-y-1 text-left bg-gray-900/30 rounded-lg p-4">
                <li>• Complete your profile setup</li>
                <li>• Upload your first project</li>
                <li>• Connect with other creators</li>
                {isFounding50 && <li>• Explore Founding 50 exclusive features</li>}
              </ul>
            </div>
            <button
              onClick={() => {
                onComplete({
                  name: name.trim(),
                  role: role.trim(),
                  company: company.trim() || undefined,
                  bio: bio.trim(),
                  avatar: avatar.trim() || undefined,
                  inviteCode: inviteCode.trim() || undefined,
                  isFounding50,
                });
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-3 rounded-lg transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Profile Step */}
        {step === 'profile' && (
          <div className="space-y-6">
            {isFounding50 && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-purple-300 font-bold">
                  Founding 50 Status Active
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Role / Title *
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g., Director, Producer, Creator"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Your company or network"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Bio *
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your work..."
                  rows={4}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Avatar URL (Optional)
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep('invite');
                  triggerHaptic('light');
                }}
                className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors active:scale-95"
              >
                Back
              </button>
              <button
                onClick={handleSubmitProfile}
                disabled={!name.trim() || !role.trim() || !bio.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:opacity-50 text-white font-black py-3 rounded-lg transition-all active:scale-95"
              >
                Create Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



