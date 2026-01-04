import { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import { triggerHaptic } from '../../utils/helpers';

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface CommentsProps {
  showId: string;
  comments: Comment[];
  onCommentSubmit?: (text: string) => void;
}

export const Comments = ({ showId, comments, onCommentSubmit }: CommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onCommentSubmit?.(newComment.trim());
      setNewComment('');
      triggerHaptic('medium');
      console.log(`[MOCK] Comment submitted for show ${showId}: ${newComment}`);
    }
  };

  const toggleLike = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
    triggerHaptic('light');
  };

  return (
    <div className="bg-[#0F172A] min-h-[400px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white">Comments</h2>
        <p className="text-xs text-gray-400 mt-1">{comments.length} comments</p>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm mb-2">Be the first to vibe with this scene. 👇</p>
          </div>
        ) : (
          comments.map(comment => {
            const isLiked = likedComments.has(comment.id);
            return (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{comment.username}</span>
                    <span className="text-xs text-gray-400">{formatTimeAgo(comment.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{comment.text}</p>
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    <span>{comment.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Comment Input */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-black/50 border border-gray-700 rounded-full px-4 py-2 text-white text-sm focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};


