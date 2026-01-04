import { useState, useEffect, ReactNode } from 'react';
import { OnboardingPage } from '../pages/OnboardingPage';
import { ProfileSetupPage } from '../pages/ProfileSetupPage';
import type { CompleteOnboardingData } from './onboarding/OnboardingModal';

interface ProfileGateProps {
  children: ReactNode;
  onComplete: (data: CompleteOnboardingData) => void;
}

export const ProfileGate = ({ children, onComplete }: ProfileGateProps) => {
  const [bootLoading, setBootLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Boot sequence: Check for session and guest state
    const checkAuth = async () => {
      setBootLoading(true);

      // Check for guest state
      const guestState = localStorage.getItem('vertikal_is_guest');
      if (guestState === 'true') {
        setIsGuest(true);
        setBootLoading(false);
        return;
      }

      // Check for session token
      const token = localStorage.getItem('vertikal_token');
      const userStr = localStorage.getItem('vertikal_user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setSession(user);

          // Check for profile (in production, this would be an API call)
          // For now, if we have a user, assume profile exists
          setProfile(user);
        } catch (err) {
          console.error('Failed to parse user data:', err);
          localStorage.removeItem('vertikal_token');
          localStorage.removeItem('vertikal_user');
        }
      }

      setBootLoading(false);
    };

    checkAuth();
  }, []);

  const handleOnboardingComplete = (data: CompleteOnboardingData) => {
    // Clear guest state
    localStorage.removeItem('vertikal_is_guest');
    setIsGuest(false);

    // Set session (in production, this would come from API)
    const user = {
      id: data.profile.handle || data.profile.stageName.toLowerCase().replace(/\s+/g, '-'),
      email: data.email,
      displayName: data.profile.stageName,
      handle: 'handle' in data.profile ? (data.profile as any).handle : undefined,
    };

    setSession(user);
    setProfile(user);
    onComplete(data);
  };

  // Loading state
  if (bootLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // ProfileGate routing logic (exact as specified)
  if (session) {
    if (profileLoading) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-black">
          <div className="text-white text-lg">Loading...</div>
        </div>
      );
    }
    if (!profile) {
      return (
        <ProfileSetupPage
          email={session.email || ''}
          verificationCode=""
          onComplete={(profileData) => {
            // Update profile state
            setProfile({
              ...session,
              ...profileData,
            });
          }}
        />
      );
    }
    return <>{children}</>;
  }

  if (isGuest) {
    return <>{children}</>;
  }

  return (
    <OnboardingPage
      onComplete={handleOnboardingComplete}
      onGuestContinue={() => {
        setIsGuest(true);
        setBootLoading(false);
      }}
    />
  );
};

