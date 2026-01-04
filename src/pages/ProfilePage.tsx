import { useState } from 'react';
import { ChevronLeft, CheckCircle, Globe, Clapperboard, UserPlus, ShoppingBag, Settings } from 'lucide-react';
import { BadgeOverlay } from '../components/features/BadgeOverlay';
import { SubscriptionModal } from '../components/modals/SubscriptionModal';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { ApplyFormModal } from '../components/modals/ApplyFormModal';
import { triggerHaptic } from '../utils/helpers';
import type { Creator } from '../utils/types';

interface ProfilePageProps {
  creatorId: string;
  creators: Record<string, Creator>;
  onBack?: () => void;
  onOpenChat: (id: string) => void;
  isMyProfile?: boolean;
}

export const ProfilePage = ({ creatorId, creators, onBack, onOpenChat, isMyProfile = false }: ProfilePageProps) => {
  const [side, setSide] = useState<'projects' | 'shop' | 'crew' | 'bts'>('projects');
  const [showSubModal, setShowSubModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const creator = creators[creatorId] || creators[Object.keys(creators)[0]];
  const isNetwork = creator?.type === 'network';

  if (!creator) return null;

  const handleProfileUpdate = (updatedProfile: Partial<Creator>) => {
    // In production, this would update the database
    // For now, we'll update the local creators object
    console.log('[MOCK] Profile updated:', updatedProfile);
    // The actual update would happen via API call
    triggerHaptic('heavy');
  };

  return (
    <div className="pb-24 animate-spring-up h-full overflow-y-auto no-scrollbar bg-black absolute inset-0 z-40">
      {showSubModal && (
        <SubscriptionModal creator={creator} onClose={() => setShowSubModal(false)} />
      )}
      {showEditModal && (
        <EditProfileModal
          creator={creator}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
      {showApplyModal && selectedJob && (
        <ApplyFormModal
          job={selectedJob}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedJob(null);
          }}
        />
      )}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
      {onBack && (
        <button
          onClick={onBack}
            className="bg-black/50 p-2 rounded-full backdrop-blur active:scale-90 transition-transform"
        >
          <ChevronLeft className="text-white" />
        </button>
      )}
        {isMyProfile && (
          <button
            onClick={() => {
              setShowEditModal(true);
              triggerHaptic('medium');
            }}
            className="bg-black/50 p-2 rounded-full backdrop-blur active:scale-90 transition-transform ml-auto"
          >
            <Settings className="text-white w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <div className="relative mb-4">
          <div
            className={`w-24 h-24 rounded-full p-1 relative ${
              isNetwork ? 'gold-gradient' : 'brand-gradient'
            }`}
          >
            <img
              src={creator.avatar}
              className="w-full h-full rounded-full bg-black object-cover"
              alt={creator.name}
            />
            <BadgeOverlay creator={creator} size="md" />
          </div>
          {isNetwork && (
            <div className="absolute -bottom-2 bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full border-2 border-black">
              NETWORK
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 mb-1 mt-3">
          <h1 className="text-2xl font-bold">{creator.name}</h1>
          <CheckCircle
            className={`w-4 h-4 ${isNetwork ? 'text-yellow-500' : 'text-blue-500'}`}
          />
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          {isNetwork ? (
            <Globe className="w-3 h-3" />
          ) : (
            <Clapperboard className="w-3 h-3" />
          )}
          <span>{creator.role}</span>
        </div>
        <p className="text-sm text-gray-300 text-center max-w-xs mb-6">{creator.bio}</p>
        <div className="flex justify-around w-full max-w-sm mb-6 border-y border-gray-800 py-4">
          <div className="text-center">
            <div className="text-xl font-black">{creator.stats.fans}</div>
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">
              {isNetwork ? 'Subscribers' : 'Fans'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black">{creator.stats.series}</div>
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">Series</div>
          </div>
          <div className="text-center">
            <div
              className={`text-xl font-black ${isNetwork ? 'text-yellow-500' : 'text-blue-500'}`}
            >
              {creator.stats.views || '500+'}
            </div>
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">
              {isNetwork ? 'Views' : 'Connections'}
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full mb-8">
          {isNetwork ? (
            <button
              onClick={() => {
                setShowSubModal(true);
                triggerHaptic('heavy');
              }}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              SUBSCRIBE ${creator.subPrice}
            </button>
          ) : (
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
              onClick={() => triggerHaptic('medium')}
            >
              <UserPlus className="w-4 h-4" />
              Follow
            </button>
          )}
          <button
            onClick={() => {
              onOpenChat(creatorId);
              triggerHaptic('light');
            }}
            className="flex-1 bg-[#1A1A1A] border border-gray-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Message <span className="text-[10px] opacity-50 ml-1">/ Tip</span>
          </button>
        </div>
        <div className="flex w-full justify-between px-8 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
          <button
            onClick={() => {
              setSide('projects');
              triggerHaptic('light');
            }}
            className={`pb-2 border-b-2 transition ${
              side === 'projects' ? 'text-white border-white' : 'border-transparent'
            }`}
          >
            {isNetwork ? 'Catalogue' : 'Projects'}
          </button>
          {!isNetwork && (
            <button
              onClick={() => {
                setSide('shop');
                triggerHaptic('light');
              }}
              className={`pb-2 border-b-2 transition ${
                side === 'shop' ? 'text-white border-white' : 'border-transparent'
              }`}
            >
              Shop
            </button>
          )}
          <button
            onClick={() => {
              setSide('crew');
              triggerHaptic('light');
            }}
            className={`pb-2 border-b-2 transition ${
              side === 'crew' ? 'text-white border-white' : 'border-transparent'
            }`}
          >
            {isNetwork ? 'Roster' : 'Crew Openings'}
          </button>
          <button
            onClick={() => {
              setSide('bts');
              triggerHaptic('light');
            }}
            className={`pb-2 border-b-2 transition ${
              side === 'bts' ? 'text-white border-white' : 'border-transparent'
            }`}
          >
            BTS
          </button>
        </div>

        {/* CONTENT */}
        {side === 'projects' && (
          <div className="grid grid-cols-3 gap-1 w-full animate-pop">
            {creator.projects && creator.projects.length > 0 ? (
              creator.projects.map((proj, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] relative bg-slate-900 group overflow-hidden"
                >
                  <img
                    src={proj.img}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                    alt={proj.title}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent">
                    <span className="text-[8px] bg-white/20 px-1 rounded backdrop-blur text-white font-bold">
                      {proj.type}
                    </span>
                    <p className="text-[10px] font-bold leading-tight truncate">{proj.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-600 text-xs">
                No projects listed yet.
              </div>
            )}
          </div>
        )}

        {side === 'shop' && (
          <div className="w-full grid grid-cols-2 gap-3 animate-pop">
            {creator.products?.map((prod, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                <div className="aspect-square bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                  <ShoppingBag className="text-gray-600" />
                </div>
                <h4 className="font-bold text-sm leading-tight mb-1">{prod.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-bold">{prod.price}</span>
                  <span className="text-[10px] text-gray-500">{prod.sold} sold</span>
                </div>
              </div>
            ))}
            {!creator.products && (
              <div className="col-span-2 text-center py-8 text-gray-500 text-xs">
                Store empty.
              </div>
            )}
          </div>
        )}

        {side === 'crew' && (
          <div className="w-full space-y-3 px-1 text-center py-10 text-gray-500 text-xs animate-pop">
            {isNetwork ? (
              <div className="grid grid-cols-4 gap-4">
                {creator.roster?.map(id => {
                  const rosterCreator = creators[id];
                  return (
                    <div key={id} className="flex flex-col items-center">
                      <img
                        src={rosterCreator?.avatar || ''}
                        className="w-12 h-12 rounded-full mb-1 object-cover"
                        alt={rosterCreator?.name}
                      />
                      <span className="text-[9px] text-white">
                        {rosterCreator?.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : creator.jobs && creator.jobs.length > 0 ? (
              creator.jobs.map((job, i) => (
                <div
                  key={i}
                  className="glass-panel p-4 rounded-xl border-l-4 border-green-500 text-left"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-green-400 font-bold text-xs bg-green-900/30 px-2 py-1 rounded">
                      OPEN ROLE
                    </span>
                    <span className="text-[10px] text-gray-500">{job.type}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{job.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{job.proj}</p>
                  <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
                    <span className="font-mono font-bold text-white text-xs">{job.rate}</span>
                    <button
                      className="bg-white text-black px-3 py-1 rounded text-xs font-bold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowApplyModal(true);
                        triggerHaptic('medium');
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              'No active job listings.'
            )}
          </div>
        )}

        {side === 'bts' && (
          <div className="w-full columns-2 gap-2 px-1 space-y-2 animate-pop">
            {creator.bts && creator.bts.length > 0 ? (
              creator.bts.map((img, i) => (
                <div key={i} className="break-inside-avoid mb-2">
                  <img src={img} className="w-full rounded-lg bg-gray-800" alt={`BTS ${i + 1}`} />
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 text-xs w-full col-span-2">
                No BTS content uploaded yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


