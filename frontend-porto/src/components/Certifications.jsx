import { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, ExternalLink, Loader2, Sparkles, Building2, FileText } from 'lucide-react';

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/skills');
        const data = response.data?.data;
        if (Array.isArray(data)) {
          setCerts(data);
        }
      } catch (error) {
        console.error("Error fetching certifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  if (loading) {
    return (
      <section id="certifications" className="relative py-20 sm:py-28">
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400 text-sm tracking-wider ml-3 animate-pulse">Loading data...</p>
        </div>
      </section>
    );
  }

  if (!Array.isArray(certs) || certs.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="relative py-20 sm:py-28 bg-slate-950/40 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute top-32 -right-32 w-72 h-72 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute bottom-32 -left-32 w-72 h-72 rounded-full bg-cyan-600/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Pencapaian</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-white">
            Sertifikasi{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Kompetensi
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Kumpulan sertifikasi profesional yang telah saya peroleh untuk terus meningkatkan kompetensi.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Compact Certifications Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert, i) => {
            const certName = cert.name || 'Sertifikat';
            const certIssuer = cert.issuer || '';
            const certCategory = cert.category || '';
            const certLink = cert.link_sertifikat || '';

            return (
              <div
                key={cert.id || i}
                className="group relative bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                <div>
                  {/* Category Badge & Award Icon */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {certCategory ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {certCategory}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Award className="w-4 h-4 text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Certificate Title */}
                  <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                    {certName}
                  </h3>

                  {/* Issuer Organization */}
                  {certIssuer && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{certIssuer}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-3 border-t border-slate-800/60 mt-auto">
                  {certLink ? (
                    <a
                      href={certLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 hover:border-blue-500 transition-all duration-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Lihat Sertifikat
                    </a>
                  ) : (
                    <div className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-800/30 border border-slate-800/50 cursor-not-allowed">
                      <FileText className="w-3.5 h-3.5" />
                      Belum Ada Link
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
