import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../utils/helpers';
import { verifyCode, claimCode } from '../lib/mockVerification';

interface CodeVerificationProps {
  email: string;
  onBack: () => void;
  onVerifySuccess: (code: string) => void;
}

export const CodeVerification = ({
  email,
  onBack,
  onVerifySuccess,
}: CodeVerificationProps) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    reason?: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!code.trim()) {
      setVerificationResult({
        valid: false,
        reason: 'Please enter a verification code',
      });
      triggerHaptic('heavy');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);
    triggerHaptic('light');

    const result = await verifyCode(code.trim());

    if (result.success) {
      // Claim the code and trigger email
      await claimCode(code.trim(), email);

      setVerificationResult({ valid: true });
      triggerHaptic('heavy');

      // Auto-advance after short delay
      setTimeout(() => {
        onVerifySuccess(code.trim().toUpperCase());
      }, 1500);
    } else {
      setVerificationResult({
        valid: false,
        reason: result.message,
      });
      triggerHaptic('heavy');
    }

    setIsVerifying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Verify Your Code</h3>
        <p className="text-gray-400 text-sm">
          Enter your Founding 50 verification code
        </p>
        <p className="text-gray-500 text-xs mt-2">Email: {email}</p>
      </div>

      {/* Code Input */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">
          Verification Code
        </label>
        <div className="relative">
          <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={code}
            onChange={e => {
              // Allow alphanumeric, hyphens, and underscores (for F50-001, FOUNDING_GENESIS)
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\-_]/g, '').slice(0, 20);
              setCode(value);
              setVerificationResult(null);
            }}
            placeholder="F50-001 or FOUNDING_GENESIS"
            className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono uppercase"
            disabled={isVerifying}
            autoFocus
          />
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-xl border-2 ${
            verificationResult.valid
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {verificationResult.valid ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="font-bold text-green-400">Code Verified!</div>
                  <div className="text-sm text-gray-300">
                    Welcome to the Founding 50. Redirecting...
                  </div>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <div className="font-bold text-red-400">Verification Failed</div>
                  <div className="text-sm text-gray-300">
                    {verificationResult.reason}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={!code.trim() || isVerifying || verificationResult?.valid}
        className="w-full brand-gradient py-4 rounded-lg font-bold text-white shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verifying...</span>
          </>
        ) : verificationResult?.valid ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Verified!</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Verify Code</span>
          </>
        )}
      </button>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center">
        Can&apos;t find your code? Check your email or contact support.
      </p>
    </motion.div>
  );
};

