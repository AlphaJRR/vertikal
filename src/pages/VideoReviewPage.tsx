/**
 * Video Review Page
 * Frame.io-style video review with timestamped comments
 */

import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Play, Pause, MessageSquare, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast';
import './VideoReviewPage.css';

interface Deliverable {
  id: string;
  name: string;
  type: string;
  file_url: string | null;
  thumbnail_url: string | null;
  project_id: string;
}

interface ReviewComment {
  id: string;
  deliverable_id: string;
  user_id: string;
  timestamp_seconds: number;
  comment_text: string;
  is_resolved: boolean;
  created_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default function VideoReviewPage() {
  const { deliverableId } = useParams<{ deliverableId: string }>();
  const { user, profile } = useAuth();
  const [deliverable, setDeliverable] = useState<Deliverable | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (deliverableId && user) {
      fetchDeliverable();
      fetchComments();
    }
  }, [deliverableId, user]);

  const fetchDeliverable = async () => {
    if (!deliverableId) return;

    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('id', deliverableId)
        .single();

      if (error) throw error;
      setDeliverable(data);
    } catch (error: any) {
      console.error('Error fetching deliverable:', error);
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!deliverableId) return;

    try {
      const { data, error } = await supabase
        .from('review_comments')
        .select(`
          *,
          profile:profiles(full_name, avatar_url)
        `)
        .eq('deliverable_id', deliverableId)
        .order('timestamp_seconds', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !deliverableId || !user) return;

    try {
      const { error } = await supabase.from('review_comments').insert({
        deliverable_id: deliverableId,
        user_id: user.id,
        timestamp_seconds: currentTime,
        comment_text: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      fetchComments();
      toast.success('Comment added');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleSeekToComment = (timestamp: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timestamp);
      setPlaying(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="video-review-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!deliverable || !deliverable.file_url) {
    return (
      <div className="video-review-error">
        <p>Video not found</p>
        <Link to="/client-portal" className="back-link">
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="video-review-page safe-area-top">
      <header className="review-header">
        <Link to="/client-portal" className="back-button">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="review-title">{deliverable.name}</h1>
      </header>

      <main className="review-main">
        <div className="video-section">
          <div className="video-player-wrapper">
            <ReactPlayer
              ref={playerRef}
              url={deliverable.file_url}
              playing={playing}
              controls
              width="100%"
              height="100%"
              onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          </div>

          <div className="comment-input-section">
            <div className="current-time-display">
              Current time: {formatTime(currentTime)}
            </div>
            <div className="comment-input-wrapper">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
                placeholder="Add a comment at this timestamp..."
                className="comment-input"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="comment-send-button"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="comments-section">
          <h2 className="comments-title">
            <MessageSquare className="w-5 h-5" />
            Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <div className="empty-comments">
              <p>No comments yet. Add your first comment above!</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`comment-item ${comment.is_resolved ? 'resolved' : ''}`}
                >
                  <div className="comment-header">
                    <div className="comment-author">
                      {comment.profile?.avatar_url ? (
                        <img
                          src={comment.profile.avatar_url}
                          alt={comment.profile.full_name || 'User'}
                          className="comment-avatar"
                        />
                      ) : (
                        <div className="comment-avatar-placeholder">
                          {(comment.profile?.full_name || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="comment-author-name">
                          {comment.profile?.full_name || 'User'}
                        </p>
                        <button
                          onClick={() => handleSeekToComment(comment.timestamp_seconds)}
                          className="comment-timestamp"
                        >
                          {formatTime(comment.timestamp_seconds)}
                        </button>
                      </div>
                    </div>
                    {comment.is_resolved && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="comment-text">{comment.comment_text}</p>
                  <p className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
