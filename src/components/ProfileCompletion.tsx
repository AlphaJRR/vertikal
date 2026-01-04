import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Hash, FileText, Image, Link as LinkIcon, Save, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/helpers';

interface ProfileCompletionProps {
  email: string;
  verificationCode: string;
  onComplete: (profileData: ProfileData) => void;
}

export interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  tags: string[];
  profilePicture?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export const ProfileCompletion = ({
  email,
  verificationCode,
  onComplete,
}: ProfileCompletionProps) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !handle.trim() || !bio.trim()) {
      triggerHaptic('heavy');
      return;
    }

    setIsSaving(true);
    triggerHaptic('medium');

    // Parse tags (comma-separated)
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const profileData: ProfileData = {
      name: name.trim(),
      handle: handle.trim().toLowerCase().replace(/\s+/g, '-'),
      bio: bio.trim(),
      tags: tagsArray,
      profilePicture: profilePicture.trim() || undefined,
      socialLinks: {
        instagram: instagram.trim() || undefined,
        twitter: twitter.trim() || undefined,
        website: website.trim() || undefined,
      },
    };

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save to mock store (in production, this would be a database call)
    console.log('[MOCK] Saving profile data:', profileData);
    console.log('[MOCK] Email:', email);
    console.log('[MOCK] Verification Code:', verificationCode);

    setIsSaving(false);
    triggerHaptic('heavy');
    onComplete(profileData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Founding 50 Badge */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <div>
          <div className="font-bold text-purple-400 text-sm">Founding 50 Status</div>
          <div className="text-xs text-gray-400">Complete your profile to activate</div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Complete Your Profile</h3>
        <p className="text-gray-400 text-sm">
          Your profile is your storefront, portfolio, and digital studio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Name *
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Handle */}
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Handle *
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="your-handle"
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">This will be your unique @handle</p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Bio *
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself and your work..."
              rows={4}
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="director, cinematographer, editor (comma-separated)"
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Profile Picture URL
          </label>
          <div className="relative">
            <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="url"
              value={profilePicture}
              onChange={e => setProfilePicture(e.target.value)}
              placeholder="https://..."
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-3 pt-2 border-t border-gray-800">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">
            Social Links (Optional)
          </label>

          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              placeholder="@instagram or URL"
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
              placeholder="@twitter or URL"
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full bg-black/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving || !name.trim() || !handle.trim() || !bio.trim()}
          className="w-full brand-gradient py-4 rounded-lg font-bold text-white shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Complete Profile</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};


