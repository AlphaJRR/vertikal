import type { Project } from '../../utils/types';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  // ✅ CRITICAL: Verify we have a valid thumbnail URL
  const hasValidThumbnail = project.img && project.img.trim() !== '' && !project.img.includes('placeholder');
  const isCloudflare = project.img?.includes('cloudflarestream.com');
  
  // ✅ CRITICAL DEBUG: Log thumbnail status
  if (typeof window !== 'undefined') {
    if (isCloudflare) {
      console.log('[ProjectCard] ✅ Using Cloudflare thumbnail:', project.img);
    } else if (!hasValidThumbnail) {
      console.error('[ProjectCard] ❌ INVALID THUMBNAIL:', project.title, project.img);
    }
  }
  
  // ✅ CRITICAL: Don't render if no valid thumbnail
  if (!hasValidThumbnail) {
    console.error('[ProjectCard] ❌ SKIPPING RENDER - No valid thumbnail for:', project.title);
    return null;
  }
  
  return (
    <div
      className="min-w-[128px] h-48 rounded-lg overflow-hidden relative group border border-white/10 active:scale-95 transition-transform cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={project.img} 
        className="w-full h-full object-cover" 
        alt={project.title}
        onError={(e) => {
          console.error('[ProjectCard] ❌ THUMBNAIL LOAD FAILED:', {
            title: project.title,
            url: project.img,
            error: 'Image failed to load'
          });
          // Don't show placeholder - let the error be visible so we can debug
        }}
        onLoad={() => {
          if (isCloudflare) {
            console.log('[ProjectCard] ✅ Cloudflare thumbnail loaded successfully:', project.title);
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2">
        <p className="text-[10px] font-bold leading-tight">{project.title}</p>
        {project.creatorName && (
          <p className="text-[8px] text-gray-300 truncate">{project.creatorName}</p>
        )}
      </div>
      <div className="absolute top-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide">
        {project.type}
      </div>
    </div>
  );
};


