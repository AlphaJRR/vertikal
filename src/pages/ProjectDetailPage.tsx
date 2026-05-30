/**
 * Project Detail Page
 * Shows project information and deliverables for review
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Clock, CheckCircle, FileVideo, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';
import './ProjectDetailPage.css';

interface Project {
  id: string;
  name: string;
  description: string | null;
  package_type: string;
  status: string;
  shoot_date: string | null;
  shoot_location: string | null;
  total_amount: number;
  deposit_amount: number;
  deposit_paid: boolean;
  created_at: string;
}

interface Deliverable {
  id: string;
  name: string;
  type: string;
  status: string;
  version: number;
  file_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
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

const deliverableStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: '#6B7280' },
  processing: { label: 'Processing', color: '#8B5CF6' },
  ready_for_review: { label: 'Ready for Review', color: '#F97316' },
  approved: { label: 'Approved', color: '#10B981' },
  revision_requested: { label: 'Revision Requested', color: '#EF4444' },
  final: { label: 'Final', color: '#10B981' },
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchProject();
    }
  }, [id, user]);

  const fetchProject = async () => {
    if (!id || !user) return;

    try {
      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('client_id', user.id)
        .single();

      if (projectError) {
        throw projectError;
      }

      setProject(projectData);

      // Fetch deliverables
      const { data: deliverablesData, error: deliverablesError } = await supabase
        .from('deliverables')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (deliverablesError) {
        console.error('Error fetching deliverables:', deliverablesError);
      } else {
        setDeliverables(deliverablesData || []);
      }
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (deliverableId: string) => {
    window.location.href = `/review/${deliverableId}`;
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-error">
        <p>Project not found</p>
        <Link to="/client-portal" className="back-link">
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>
      </div>
    );
  }

  const status = statusConfig[project.status] || statusConfig.inquiry;

  return (
    <div className="project-detail-page safe-area-top">
      <header className="project-detail-header">
        <Link to="/client-portal" className="back-button">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="project-detail-title">{project.name}</h1>
      </header>

      <main className="project-detail-main">
        <div className="project-info-card">
          <div className="project-info-header">
            <div>
              <h2 className="project-info-title">Project Details</h2>
              <p className="project-info-package">{project.package_type}</p>
            </div>
            <span
              className="project-info-status"
              style={{
                backgroundColor: `${status.color}20`,
                color: status.color,
              }}
            >
              {status.label}
            </span>
          </div>

          {project.description && (
            <p className="project-info-description">{project.description}</p>
          )}

          <div className="project-info-grid">
            {project.shoot_date && (
              <div className="info-item">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="info-label">Shoot Date</p>
                  <p className="info-value">
                    {new Date(project.shoot_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
            {project.shoot_location && (
              <div className="info-item">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="info-label">Location</p>
                  <p className="info-value">{project.shoot_location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="project-pricing">
            <div className="pricing-item">
              <span className="pricing-label">Total Amount</span>
              <span className="pricing-value">${project.total_amount}</span>
            </div>
            <div className="pricing-item">
              <span className="pricing-label">Deposit</span>
              <span className={`pricing-value ${project.deposit_paid ? 'paid' : ''}`}>
                ${project.deposit_amount} {project.deposit_paid ? '✓ Paid' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="deliverables-section">
          <h2 className="section-title">Deliverables</h2>
          {deliverables.length === 0 ? (
            <div className="empty-deliverables">
              <FileVideo className="w-12 h-12" />
              <p>No deliverables yet</p>
            </div>
          ) : (
            <div className="deliverables-list">
              {deliverables.map((deliverable) => {
                const delStatus =
                  deliverableStatusConfig[deliverable.status] ||
                  deliverableStatusConfig.pending;
                const isReviewable = ['ready_for_review', 'revision_requested'].includes(
                  deliverable.status
                );
                const isDownloadable = ['approved', 'final'].includes(deliverable.status);

                return (
                  <div key={deliverable.id} className="deliverable-card">
                    <div className="deliverable-header">
                      <div className="deliverable-info">
                        <h3 className="deliverable-name">{deliverable.name}</h3>
                        <p className="deliverable-type">
                          {deliverable.type} • Version {deliverable.version}
                        </p>
                      </div>
                      <span
                        className="deliverable-status"
                        style={{
                          backgroundColor: `${delStatus.color}20`,
                          color: delStatus.color,
                        }}
                      >
                        {delStatus.label}
                      </span>
                    </div>

                    {deliverable.thumbnail_url && (
                      <div className="deliverable-thumbnail">
                        <img
                          src={deliverable.thumbnail_url}
                          alt={deliverable.name}
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="deliverable-actions">
                      {isReviewable && (
                        <button
                          onClick={() => handleReview(deliverable.id)}
                          className="action-button primary"
                        >
                          Review
                        </button>
                      )}
                      {isDownloadable && deliverable.file_url && (
                        <button
                          onClick={() =>
                            handleDownload(deliverable.file_url!, deliverable.name)
                          }
                          className="action-button secondary"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
