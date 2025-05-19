// components/ProjectCard.js
import { ExternalLink, Tag } from 'lucide-react';

// Project Card Component
const ProjectCard = ({ project }) => {
  // Determine the media URL. Use the first one if available.
  const mediaUrl = project.media_url && project.media_url.length > 0 ? project.media_url[0] : null;
  // Placeholder image URL, dynamically generated using project title
  const placeholderImageUrl = `https://placehold.co/600x400/e2e8f0/334155?text=${encodeURIComponent(project.title.substring(0, 20))}`; // Darker text for better contrast

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-sky-500/30 hover:-translate-y-1 break-inside-avoid-column mb-6 border border-slate-700 hover:border-sky-500">
      <a href={project.project_page_url} target="_blank" rel="noopener noreferrer" className="block group">
        <div className="relative w-full aspect-[4/3] bg-slate-700 flex items-center justify-center overflow-hidden">
          {project.media_type === "video" && mediaUrl ? (
            <>
              <video
                key={mediaUrl} // Add key to re-render video element if src changes
                src={mediaUrl}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                controls={false}
                autoPlay
                loop
                muted
                playsInline
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              >
                Your browser does not support the video tag.
              </video>
              {/* Fallback for video error, initially hidden */}
              <img 
                src={placeholderImageUrl} 
                alt={`Placeholder for ${project.title}`} 
                className="w-full h-full object-cover" 
                style={{display: 'none'}} 
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 opacity-80">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
              </div>
            </>
          ) : (
            <img
              src={mediaUrl || placeholderImageUrl}
              alt={`Cover image for ${project.title}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.src = placeholderImageUrl; }}
            />
          )}
        </div>
      </a>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-sky-400 mb-2 truncate" title={project.title}>
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm mb-3 h-20 overflow-y-auto custom-scrollbar" title={project.description}>
          {project.description || "No description available."}
        </p>
        <div className="mb-4 min-h-[2.5rem]"> {/* Ensure minimum height for tags area */}
          {project.categories && project.categories.slice(0, 3).map((category, index) => ( // Limit to 3 tags initially
            <span
              key={index}
              className="inline-block bg-slate-700 text-sky-300 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full"
            >
              <Tag className="inline-block w-3 h-3 mr-1.5" />{category}
            </span>
          ))}
        </div>
        <a
          href={project.project_page_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sky-500 hover:text-sky-400 font-medium text-sm transition-colors group"
        >
          View Project <ExternalLink className="ml-1.5 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
