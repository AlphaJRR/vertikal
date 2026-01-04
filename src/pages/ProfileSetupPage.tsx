import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Hash, FileText, Image, Loader2, CheckCircle } from 'lucide-react';
import { mockUpload } from '../lib/mockUpload';
import { triggerHaptic } from '../utils/helpers';
import founding50Data from '../data/founding50.json';

interface ProfileSetupPageProps {
  email: string;
  verificationCode: string;
  onComplete: (profileData: ProfileData) => void;
}

export interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  tags: string[];
  profile_picture?: string;
}

export const ProfileSetupPage = ({
  email,
  verificationCode,
  onComplete,
}: ProfileSetupPageProps) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if handle exists in mock data
  const handleExists = (checkHandle: string): boolean => {
    const creators = (founding50Data as { creators?: Array<{ handle?: string }> }).creators || [];
    return creators.some(c => c.handle?.toLowerCase() === checkHandle.toLowerCase());
  };

  const validateHandle = (value: string): string | null => {
    const clean = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    if (clean.length < 3) {
      return 'Handle must be at least 3 characters';
    }
    
    if (handleExists(clean)) {
      return 'This handle is already taken';
    }
    
    if (!/^[a-z0-9-]+$/.test(clean)) {
      return 'Handle can only contain letters, numbers, and dashes';
    }
    
    return null;
  };

  const handleHandleChange = (value: string) => {
    // Auto-format: lowercase, replace spaces with dashes, remove invalid chars
    const formatted = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    setHandle(formatted);
    
    // Validate
    if (formatted.length > 0) {
      const error = validateHandle(formatted);
      setErrors(prev => ({
        ...prev,
        handle: error || '',
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        handle: '',
      }));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    triggerHaptic('light');

    try {
      const dataUrl = await mockUpload(file);
      setProfilePicture(dataUrl);
      setErrors(prev => ({
        ...prev,
        profilePicture: '',
      }));
      triggerHaptic('medium');
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        profilePicture: error instanceof Error ? error.message : 'Upload failed',
      }));
      triggerHaptic('heavy');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!handle.trim()) {
      newErrors.handle = 'Handle is required';
    } else {
      const handleError = validateHandle(handle);
      if (handleError) {
        newErrors.handle = handleError;
      }
    }

    if (!bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (bio.length > 200) {
      newErrors.bio = 'Bio must be 200 characters or less';
    }

    if (!profilePicture) {
      newErrors.profilePicture = 'Profile picture is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerHaptic('heavy');
      return;
    }

    setSaving(true);
    triggerHaptic('medium');

    // Parse tags
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const profileData: ProfileData = {
      name: name.trim(),
      handle: handle.trim(),
      bio: bio.trim(),
      tags: tagsArray,
      profile_picture: profilePicture,
    };

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('[MOCK] Profile saved:', profileData);
    console.log('[MOCK] Email:', email);
    console.log('[MOCK] Verification Code:', verificationCode);

    triggerHaptic('heavy');
    onComplete(profileData);
  };

  const isFormValid = name.trim() && handle.trim() && bio.trim() && profilePicture && !errors.handle;

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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px] pointer-events-none"></div>

          <div className="relative z-10">
            {/* Icon */}
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50 mx-auto">
              <CheckCircle size={32} className="text-green-500" />
            </div>

            <h2 className="text-3xl font-black text-white mb-2 text-center">Complete Your Profile</h2>
            <p className="text-gray-400 text-sm mb-8 text-center">
              Build your profile in under 30 seconds.
              Add your name, one line about what you do, and a photo.
              You can edit everything later.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-2 block">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="Your Name"
                    className="w-full bg-black/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Handle */}
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-2 block">
                  Handle
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={handle ? `@${handle}` : ''}
                    onChange={e => {
                      const value = e.target.value.replace('@', '');
                      handleHandleChange(value);
                    }}
                    placeholder="@your-handle"
                    className="w-full bg-black/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                {errors.handle && (
                  <p className="text-red-500 text-xs mt-1">{errors.handle}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">This will be your unique @handle</p>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-2 block">
                  Bio
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
                  <textarea
                    value={bio}
                    onChange={e => {
                      const value = e.target.value.slice(0, 200);
                      setBio(value);
                      setErrors(prev => ({ ...prev, bio: '' }));
                    }}
                    placeholder="Tell us about yourself and your work..."
                    rows={4}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none transition resize-none"
                    required
                  />
                </div>
                <div className="flex justify-between mt-1">
                  {errors.bio && (
                    <p className="text-red-500 text-xs">{errors.bio}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">{bio.length}/200</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-2 block">
                  Tags / Skills
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="film, editing, comedy, lifestyle (comma-separated)"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-2 block">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white hover:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {uploading ? (
                        <span className="flex items-center gap-2 justify-center">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        'Upload Photo'
                      )}
                    </button>
                    {errors.profilePicture && (
                      <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || saving}
                className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Building Studio...</span>
                  </>
                ) : (
                  'Save & Continue'
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


