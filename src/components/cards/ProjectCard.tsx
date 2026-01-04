import type { Project } from '../../utils/types';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  // ✅ Debug: Log thumbnail URL to verify Cloudflare URLs are being used
  if (typeof window !== 'undefined' && project.img?.includes('cloudflarestream.com')) {
    console.log('[ProjectCard] Using Cloudflare thumbnail:', project.img);
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
          console.error('[ProjectCard] Thumbnail failed to load:', project.img);
          // Don't show placeholder - let the error be visible so we can debug
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


