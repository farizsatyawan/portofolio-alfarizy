import { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ArrowRight, FileText } from 'lucide-react';
import axios from 'axios';

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/profiles');
        console.log("Data Profil untuk Hero:", res.data);
        if (res.data?.data?.length > 0) {
          setProfile(res.data.data[0]);
        }
      } catch (err) {
        console.error('Error fetching profile for Hero:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleScroll = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-t-blue-500 border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin" />
          <p className="text-sm tracking-wider animate-pulse">Loading data...</p>
        </div>
      </div>
    );
  }

  const name = profile?.name || 'Alfarizy Satyawan';
  const subHeadline = profile?.sub_headline || 'Web, Mobile & IoT Developer';
  const description = profile?.description || 'Belum ada deskripsi profil.';
  
  const profilePhotoUrl = profile?.profile_photo 
    ? `http://localhost:8000/storage/profiles/${profile.profile_photo}`
    : null;

  const resumeUrl = profile?.resume_pdf
    ? `http://localhost:8000/storage/resumes/${profile.resume_pdf}`
    : null;

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16"
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[120px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[75vh]">
          {/* Kolom Kiri: Teks & Actions */}
          <div className="space-y-6 flex flex-col justify-center">
            {/* Tag line */}
            <div className="self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles size={12} className="text-blue-400 animate-pulse" />
              <span>Hi, I'm</span>
            </div>

            {/* Main headline / Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white">
              <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                {name}
              </span>
            </h1>

            {/* Subtitle / Sub Headline */}
            <p className="text-xl font-semibold text-slate-200">
              {subHeadline}
            </p>

            {/* Profile Description */}
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mt-4 max-w-lg whitespace-pre-line">
              {description}
            </p>

            {/* CTA Buttons (Contact & CV Download) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                id="cta-contact"
                href="#contact"
                onClick={(e) => handleScroll(e, '#contact')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 group"
              >
                <MessageSquare size={16} />
                Hubungi Saya
                <ArrowRight size={16} className="text-blue-200 transition-transform group-hover:translate-x-1" />
              </a>

              {resumeUrl && (
                <a
                  id="cta-download-cv"
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-medium text-sm hover:border-blue-500/50 hover:text-white hover:bg-blue-500/5 transition-all duration-300 cursor-pointer"
                >
                  <FileText size={16} />
                  Download CV
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-md">
              {[
                { value: '6+', label: 'Proyek Dibangun' },
                { value: '5+', label: 'Sertifikasi' },
                { value: '3+', label: 'Organisasi' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Foto Profil dengan Animasi Floating & Glow */}
          <div className="flex justify-center items-center">
            <div className="relative group animate-float">
              {/* Neon glow effect background */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-35 transition duration-1000 group-hover:duration-200" />
              
              {profilePhotoUrl ? (
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-2xl transition-all duration-500 group-hover:border-blue-500/50">
                  <img
                    src={profilePhotoUrl}
                    alt="Foto Profil Alfarizy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full bg-slate-900 border-2 border-slate-800/80 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-blue-500/50">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-blue-500/20">
                    <span className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                      {name ? name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
