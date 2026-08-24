import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Loader2, Folder, ChevronDown, ChevronUp } from 'lucide-react';

/* Inline GitHub SVG icon since lucide-react v1.x removed brand icons */
function GithubIcon({ size = 18, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState({});

  const toggleProject = (id) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        console.log("Respon mentah axios:", response.data);
        setProjects(response.data?.data || []);
      } catch (err) {
        console.error("Axios fatal error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="relative py-24 sm:py-32">
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400 text-sm tracking-wider ml-3 animate-pulse">Loading data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative py-24 sm:py-32 bg-slate-950/40">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-500 text-sm font-semibold tracking-widest uppercase">
            Portofolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-white">
            Proyek <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Unggulan</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Kumpulan proyek web, mobile, IoT, dan data science yang telah saya kembangkan.
            Setiap proyek mencerminkan komitmen saya terhadap kualitas kode dan pengalaman pengguna.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => {
            // Safely parse tech_stack if it is a JSON string or array
            let tags = [];
            if (project.tech_stack) {
              if (Array.isArray(project.tech_stack)) {
                tags = project.tech_stack;
              } else if (typeof project.tech_stack === 'string') {
                try {
                  const parsed = JSON.parse(project.tech_stack);
                  tags = Array.isArray(parsed) ? parsed : [project.tech_stack];
                } catch {
                  // Fallback for comma separated strings
                  tags = project.tech_stack.split(',').map((t) => t.trim());
                }
              }
            }
            tags = tags.filter(Boolean);

            // Construct image URL safely
            const imageSrc = project.image
              ? (project.image.startsWith('http') ? project.image : `http://localhost:8000/storage/projects/${project.image}`)
              : '';

            const githubUrl = project.github_url || null;
            const demoUrl = project.demo_url || null;

            return (
              <article
                key={project.id || i}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden group hover:scale-[1.02] hover:border-blue-500/40 transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-blue-500/5"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden aspect-[16/10] bg-slate-800/50 flex items-center justify-center border-b border-slate-800/60">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={`Tangkapan layar ${project.title || 'Proyek'}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2">
                        <Folder className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-xl font-semibold text-slate-300 uppercase tracking-wider">
                        {project.title ? project.title.substring(0, 2) : 'PR'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Overlay links */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {demoUrl && (
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-slate-900/85 backdrop-blur-sm flex items-center justify-center hover:bg-blue-500 text-white transition-colors border border-slate-700/50"
                        aria-label={`Lihat demo ${project.title || 'Proyek'}`}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {project.title || 'Untitled Project'}
                  </h3>
                  <div className="mb-4 flex-1">
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedProjects[project.id] ? 'max-h-[1000px]' : 'max-h-[4.2em]'
                    }`}>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {project.description || 'Tidak ada deskripsi proyek.'}
                      </p>
                    </div>
                    {project.description && project.description.length > 100 && (
                      <button
                        onClick={() => toggleProject(project.id)}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                      >
                        {expandedProjects[project.id] ? (
                          <><ChevronUp className="w-3 h-3" /> Lihat Lebih Sedikit</>
                        ) : (
                          <><ChevronDown className="w-3 h-3" /> Selengkapnya</>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tags.length > 0 ? (
                      tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/15"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-400 border border-slate-700/40">
                        General
                      </span>
                    )}
                  </div>

                  {/* GitHub button */}
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-blue-500/20 border border-slate-700/60 hover:border-blue-500/30 text-slate-300 hover:text-blue-300 font-medium text-sm transition-all duration-300"
                    >
                      <GithubIcon size={16} />
                      Lihat di GitHub
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
