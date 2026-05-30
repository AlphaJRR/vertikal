/**
 * Client Portal Page
 * Main dashboard for clients to view and manage their projects
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Folder, Clock, CheckCircle, Download, Plus, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import toast from 'react-hot-toast';
import './ClientPortalPage.css';

interface Project {
  id: string;
  name: string;
  package_type: string;
  status: string;
  shoot_date: string | null;
  deliverables: Deliverable[];
}

interface Deliverable {
  id: string;
  status: string;
  name: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  inquiry: { label: 'Inquiry', color: '#6B7280' },
  quoted: { label: 'Quoted', color: '#8B5CF6' },
  booked: { label: 'Booked', color: '#10B981' },
  planning: { label: 'Planning', color: '#F59E0B' },
  production: { label: 'Production', color: '#EC4899' },
  editing: { label: 'Editing', color: '#8B5CF6' },
  review: { label: 'Ready for Review', color: '#F97316' },
  revisions: { label: 'Revisions', color: '#EF4444' },
  delivered: { label: 'Delivered', color: '#10B981' },
  completed: { label: 'Completed', color: '#6B7280' },
  cancelled: { label: 'Cancelled', color: '#6B7280' },
};

export default function ClientPortalPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (!isSupabaseConfigured) {
        // DEMO MODE: show sample projects immediately
        setProjects([
          {
            id: 'demo-project-1',
            name: 'Brand Campaign — Launch Video',
            package_type: 'Commercial Production',
            status: 'review',
            shoot_date: new Date().toISOString(),
            deliverables: [
              { id: 'demo-deliv-1', name: 'Edit v1', status: 'ready_for_review' },
              { id: 'demo-deliv-2', name: 'Teaser Cut', status: 'processing' },
            ],
          },
          {
            id: 'demo-project-2',
            name: 'Event Coverage — Recap',
            package_type: 'Event Coverage',
            status: 'editing',
            shoot_date: new Date(Date.now() - 7 * 86400000).toISOString(),
            deliverables: [{ id: 'demo-deliv-3', name: 'Recap v2', status: 'processing' }],
          },
        ]);
        setLoading(false);
        return;
      }

      fetchProjects();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          deliverables (
            id,
            name,
            status
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        // Don't show toast if table doesn't exist yet (during setup)
        if (error.code !== 'PGRST116') {
          toast.error('Failed to load projects');
        }
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const reviewCount = projects.filter(
    (p) => p.status === 'review' || p.deliverables?.some((d) => d.status === 'ready_for_review')
  ).length;

  const activeCount = projects.filter(
    (p) => !['completed', 'cancelled'].includes(p.status)
  ).length;

  const completedCount = projects.filter((p) => p.status === 'completed').length;

  if (loading) {
    return (
      <div className="client-portal-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="client-portal-page safe-area-top">
      <header className="portal-header">
        <div className="portal-header-content">
          <div className="portal-greeting">
            <p className="greeting-text">Welcome back,</p>
            <h1 className="greeting-name">{profile?.full_name || 'Client'}</h1>
          </div>
          <button className="notifications-button">
            <Bell className="w-6 h-6" />
            {reviewCount > 0 && (
              <span className="notification-badge">{reviewCount}</span>
            )}
          </button>
        </div>

        <div className="portal-stats">
          <div className="stat-card">
            <p className="stat-value">{activeCount}</p>
            <p className="stat-label">Active</p>
          </div>
          <div className="stat-card highlight">
            <p className="stat-value">{reviewCount}</p>
            <p className="stat-label">Review</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{completedCount}</p>
            <p className="stat-label">Done</p>
          </div>
        </div>
      </header>

      <main className="portal-main">
        {projects.length === 0 ? (
          <div className="empty-projects">
            <Folder className="empty-icon" />
            <h3 className="empty-title">No projects yet</h3>
            <p className="empty-description">
              Book your first session to get started
            </p>
            <Link to="/booking" className="empty-button">
              <Plus className="w-5 h-5" />
              Book Session
            </Link>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((project) => {
              const status = statusConfig[project.status] || statusConfig.inquiry;
              const readyCount =
                project.deliverables?.filter((d) =>
                  ['ready_for_review', 'final'].includes(d.status)
                ).length || 0;

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="project-card"
                >
                  <div className="project-header">
                    <div className="project-info">
                      <h3 className="project-name">{project.name}</h3>
                      <p className="project-package">{project.package_type}</p>
                    </div>
                    <span
                      className="project-status"
                      style={{
                        backgroundColor: `${status.color}20`,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="project-footer">
                    {project.shoot_date && (
                      <span className="project-date">
                        <Clock className="w-4 h-4" />
                        {new Date(project.shoot_date).toLocaleDateString()}
                      </span>
                    )}
                    {readyCount > 0 && (
                      <span className="project-ready">
                        <Download className="w-4 h-4" />
                        {readyCount} ready
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Link to="/booking" className="floating-action-button">
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}
