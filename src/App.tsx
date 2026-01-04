import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { FeedPage } from './pages/FeedPage';
import { ShowDetailPage } from './pages/ShowDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { SeriesPage } from './pages/SeriesPage';
import { ShortsPage } from './pages/ShortsPage';
import { TrailersPage } from './pages/TrailersPage';
import { StudioPage } from './pages/StudioPage';
import { InboxView } from './components/modals/InboxView';
import { ChatView } from './components/modals/ChatView';
import { ProfileGate } from './components/ProfileGate';
import { DEMO_CREATORS } from './data/demoSeed';
import type { CompleteOnboardingData } from './components/onboarding/OnboardingModal';
import { triggerHaptic } from './utils/helpers';
import type { Creator, Chat } from './utils/types';

// Mock creators data (from prototype - will be replaced with actual JSON)
const MOCK_CREATORS: Record<string, Creator> = {
  'BAF_Network': {
    id: 'BAF_Network',
    name: 'Black Awesomeness',
    role: 'Production Network',
    company: 'BAF',
    avatar: 'https://www.dropbox.com/scl/fi/7deqzj0fkqr4my6cgi9ik/Image-2.jpg?rlkey=szrgy5uqh14m7k8k3lvvu5fic&st=a6f8yfx0&raw=1',
    bio: 'The Hub for Urban Cinema.',
    stats: { fans: '150k', series: '12', views: '2.5M' },
    type: 'network',
    subPrice: '2.99',
    isFounding50: true,
    projects: [
      { title: 'The Best Burgers', type: 'DOCU', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
      { title: 'Windy City Love', type: 'SERIES', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop' },
    ],
    roster: ['joshuaargue', 'joshuaroberts'],
  },
  'joshuaargue': {
    id: 'joshuaargue',
    name: 'Joshua Argue',
    role: 'Creator / Lead',
    company: 'Black Awesomeness',
    avatar: 'https://www.dropbox.com/scl/fi/vaudy76mhaqtcukpkzeve/JoshuaArgue.JPG?rlkey=is2eixyxhseij6jft5k91zm9k&st=0mp4lgv9&raw=1',
    bio: 'Showrunner. Creating @BestBurgers.',
    stats: { fans: '42.5k', series: '8' },
    type: 'creator',
    isFounding50: true,
    projects: [
      { title: 'The Best Burgers', type: 'DOCU', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
      { title: 'Windy City Love', type: 'SERIES', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop' },
    ],
    products: [
      { title: 'Showrunner Bible Template', price: '$49', sold: '1.2k' },
      { title: "Indie Film Budget Sheet", price: '$19', sold: '850' },
    ],
    jobs: [
      { title: 'Editor (Davinci)', proj: 'Best Burgers S2', rate: '$2,500 Flat', type: 'Post-Prod' },
      { title: 'Sound Mixer', proj: 'Windy City Love', rate: '$350/Day', type: 'Production' },
    ],
  },
  'joshuaroberts': {
    id: 'joshuaroberts',
    name: 'J.R.R. Roberts',
    role: 'Founder',
    company: 'Vertikal',
    avatar: 'https://www.dropbox.com/scl/fi/v77iz4i895pqmlmzvqhsk/JoshuaRoberts.JPG?rlkey=4bag3kp7ud5y8w8ibi8s3lfa2&st=04hrxb2c&raw=1',
    bio: 'Building the Vertical Film Network.',
    stats: { fans: '28k', series: '4' },
    type: 'creator',
    isFounding50: true,
    projects: [
      { title: 'Beyond the Bases', type: 'SERIES', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop' },
    ],
    products: [
      { title: 'Cinematic LUTs Vol 1', price: '$25', sold: '2.4k' },
      { title: "Director's Treatment Keynote", price: '$35', sold: '500' },
    ],
    jobs: [
      { title: '1st AC', proj: 'Beyond the Bases', rate: '$400/Day', type: 'Camera' },
      { title: 'Gaffer', proj: 'Commercial Spec', rate: '$500/Day', type: 'Lighting' },
    ],
  },
};

const MOCK_CHATS: Chat[] = [
  { id: 1, userId: 'joshuaargue', lastMsg: 'Sent over the lens kit list 🎥', time: '2m', unread: true },
  { id: 2, userId: 'joshuaroberts', lastMsg: 'Love the new cut of Ep 3!', time: '1h', unread: false },
  { id: 3, userId: 'BAF_Network', lastMsg: 'Contract for Season 2 attached.', time: '1d', unread: false },
];

function App() {
  const [tab, setTab] = useState('home');
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [showInbox, setShowInbox] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [viewingShow, setViewingShow] = useState<string | null>(null);
  const [isStudioMode, setIsStudioMode] = useState(false);

  // Merge demo creators with mock creators
  const creators = { ...MOCK_CREATORS, ...DEMO_CREATORS };
  const myProfileId = 'joshuaroberts';

  const handleOnboardingComplete = (data: CompleteOnboardingData) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ONBOARDING COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', data.email);
    console.log('Verification Code:', data.verificationCode);
    console.log('Profile:', data.profile);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    triggerHaptic('heavy');
    // ProfileGate will handle routing
  };

  // Listen for switch to studio event from ProfilePage
  useEffect(() => {
    const handleSwitchToStudio = () => {
      setIsStudioMode(true);
      setTab('studio');
      triggerHaptic('medium');
    };
    
    window.addEventListener('switchToStudio', handleSwitchToStudio);
    return () => window.removeEventListener('switchToStudio', handleSwitchToStudio);
  }, []);

  return (
    <ProfileGate onComplete={handleOnboardingComplete}>
      {/* Main app content */}
    <div className="h-screen w-full flex flex-col bg-black max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-800">
      <Header
        onOpenInbox={() => {
          setShowInbox(true);
          triggerHaptic('medium');
        }}
        onToggleStudio={() => {
          setIsStudioMode(!isStudioMode);
          if (!isStudioMode) {
            setTab('studio');
          } else {
            setTab('home');
          }
        }}
        isStudioMode={isStudioMode}
      />
      <div className="flex-1 overflow-hidden relative app-gradient">
        {/* Show Detail Overlay */}
        {viewingShow && (
          <ShowDetailPage
            showId={viewingShow}
            onBack={() => setViewingShow(null)}
            onShowSelect={id => {
              setViewingShow(id);
              triggerHaptic('medium');
            }}
            onCreatorSelect={id => {
              setViewingProfile(id);
              setViewingShow(null);
              triggerHaptic('medium');
            }}
          />
        )}

        {/* Main Content Tabs */}
        {!viewingShow && (
          <>
                {tab === 'home' && (
                  <HomePage
                    creators={creators}
                    onViewProfile={id => {
                      setViewingProfile(id);
                      triggerHaptic('medium');
                    }}
                    onShowSelect={id => {
                      setViewingShow(id);
                      triggerHaptic('medium');
                    }}
                  />
                )}
            {tab === 'feed' && (
              <FeedPage
                onShowDetail={id => {
                  setViewingShow(id);
                  triggerHaptic('medium');
                }}
              />
            )}
            {tab === 'series' && <SeriesPage />}
            {tab === 'shorts' && <ShortsPage />}
            {tab === 'trailers' && <TrailersPage />}
            {tab === 'profile' && (
              <ProfilePage
                creatorId={myProfileId}
                creators={creators}
                isMyProfile={true}
                onOpenChat={id => {
                  setActiveChat(id);
                  triggerHaptic('medium');
                }}
              />
            )}
            {tab === 'studio' && <StudioPage />}
            {viewingProfile && (
              <ProfilePage
                creatorId={viewingProfile}
                creators={creators}
                onBack={() => setViewingProfile(null)}
                onOpenChat={id => setActiveChat(id)}
              />
            )}
          </>
        )}
      </div>
      <BottomNav activeTab={tab} setTab={setTab} myProfileId={myProfileId} creators={creators} />
      {showInbox && (
        <InboxView
          chats={MOCK_CHATS}
          creators={creators}
          onClose={() => setShowInbox(false)}
          onOpenChat={id => {
            setActiveChat(id);
            setShowInbox(false);
          }}
        />
      )}
      {activeChat && (
        <ChatView userId={activeChat} creators={creators} onClose={() => setActiveChat(null)} />
      )}
    </div>
    </ProfileGate>
  );
}

export default App;

