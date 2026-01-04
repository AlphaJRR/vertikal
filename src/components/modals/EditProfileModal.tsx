import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, User, Hash, FileText, Image, Loader2 } from 'lucide-react';
import { mockUpload } from '../../lib/mockUpload';
import { triggerHaptic } from '../../utils/helpers';
import type { Creator } from '../../utils/types';

interface EditProfileModalProps {
  creator: Creator;
  onClose: () => void;
  onSave: (updatedProfile: Partial<Creator>) => void;
}

export const EditProfileModal = ({ creator, onClose, onSave }: EditProfileModalProps) => {
  const [name, setName] = useState(creator.name);
  const [bio, setBio] = useState(creator.bio);
  const [role, setRole] = useState(creator.role);
  const [company, setCompany] = useState(creator.company);
  const [profilePicture, setProfilePicture] = useState(creator.avatar);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (bio.length > 200) {
      newErrors.bio = 'Bio must be 200 characters or less';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerHaptic('heavy');
      return;
    }

    setSaving(true);
    triggerHaptic('medium');

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedProfile: Partial<Creator> = {
      name: name.trim(),
      bio: bio.trim(),
      role: role.trim(),
      company: company.trim() || undefined,
      avatar: profilePicture,
    };

    console.log('[MOCK] Profile updated:', updatedProfile);
    triggerHaptic('heavy');
    onSave(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0F172A] border border-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white">Edit Profile</h2>
          <button
            onClick={() => {
              onClose();
              triggerHaptic('light');
            }}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

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
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-2 block">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Creator, Director, etc."
              className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-2 block">
              Company (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Your Company"
              className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
            />
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
              {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
              <p className="text-xs text-gray-500 ml-auto">{bio.length}/200</p>
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-2 block">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    'Change Photo'
                  )}
                </button>
                {errors.profilePicture && (
                  <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                triggerHaptic('light');
              }}
              className="flex-1 bg-transparent border border-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-800/50 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim() || !bio.trim()}
              className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

