import { useState, useEffect } from 'react';
import axios from 'axios';
import { GraduationCap, Users, Building2, Calendar, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const COLUMNS = [
  {
    key: 'pendidikan',
    title: 'Pendidikan',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    glowColor: 'emerald',
    borderHover: 'hover:border-emerald-500/40',
    dotBg: 'bg-emerald-500',
    dotRing: 'ring-emerald-500/20',
    iconColor: 'text-emerald-400',
    headerBg: 'bg-emerald-500/10',
  },
  {
    key: 'organisasi',
    title: 'Organisasi',
    icon: Users,
    gradient: 'from-amber-500 to-orange-600',
    glowColor: 'amber',
    borderHover: 'hover:border-amber-500/40',
    dotBg: 'bg-amber-500',
    dotRing: 'ring-amber-500/20',
    iconColor: 'text-amber-400',
    headerBg: 'bg-amber-500/10',
  },
  {
    key: 'profesional',
    title: 'Profesional',
    icon: Building2,
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'blue',
    borderHover: 'hover:border-blue-500/40',
    dotBg: 'bg-blue-500',
    dotRing: 'ring-blue-500/20',
    iconColor: 'text-blue-400',
    headerBg: 'bg-blue-500/10',
  },
];

export default function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/experiences');
        setExperiences(response.data?.data || []);
      } catch (error) {
        console.error("Error Fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section id="experiences" className="relative py-24 sm:py-32">
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400 text-sm tracking-wider ml-3 animate-pulse">Loading data...</p>
        </div>
      </section>
    );
  }

  if (!Array.isArray(experiences) || experiences.length === 0) {
    return null;
  }

  // Filter experiences by category
  const grouped = {};
  COLUMNS.forEach(col => {
    grouped[col.key] = experiences.filter(exp => (exp.category || 'profesional') === col.key);
  });

  return (
    <section id="experiences" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-emerald-600/5 blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Perjalanan Karir</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-white">
            Pengalaman{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
              & Riwayat
            </span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Rangkuman perjalanan pendidikan, organisasi, dan profesional saya.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {COLUMNS.map((col) => {
            const Icon = col.icon;
            const items = grouped[col.key];

            return (
              <div key={col.key} className="flex flex-col">
                {/* Column Header */}
                <div className={`flex items-center gap-3 mb-6 px-4 py-3 rounded-xl ${col.headerBg} border border-white/5`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${col.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{col.title}</h3>
                    <p className="text-slate-500 text-xs">{items.length} pengalaman</p>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-4 flex-1">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                      <Icon className="w-10 h-10 text-slate-700 mb-3" />
                      <p className="text-slate-600 text-sm text-center">Belum ada data {col.title.toLowerCase()}</p>
                    </div>
                  ) : (
                    items.map((exp, idx) => {
                      const startDate = exp.start_date || 'Mulai';
                      const endDate = exp.is_current ? 'Sekarang' : (exp.end_date || 'Selesai');

                      return (
                        <div
                          key={exp.id || idx}
                          className={`group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 transition-all duration-300 ${col.borderHover} hover:shadow-lg hover:shadow-${col.glowColor}-500/5 hover:-translate-y-0.5`}
                        >
                          {/* Top accent line */}
                          <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${col.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                          {/* Timeline dot */}
                          <div className="flex items-start gap-3.5 mb-3">
                            <div className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${col.dotBg} ring-4 ${col.dotRing}`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-sm leading-tight group-hover:text-white/90 transition-colors">
                                {exp.position || 'Posisi'}
                              </h4>
                              <p className={`${col.iconColor} text-xs font-medium mt-1 truncate`}>
                                {exp.company || 'Nama Instansi'}
                              </p>
                            </div>
                          </div>

                          {/* Date badge */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 ml-6">
                            <Calendar className="w-3 h-3" />
                            <span>{startDate} — {endDate}</span>
                            {exp.is_current && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Aktif
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {exp.description && (
                            <div className="ml-6">
                              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                expandedCards[exp.id] ? 'max-h-[1000px]' : 'max-h-[3.6em]'
                              }`}>
                                <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-line">
                                  {exp.description}
                                </p>
                              </div>
                              <button
                                onClick={() => toggleCard(exp.id)}
                                className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold ${col.iconColor} hover:brightness-125 transition-all cursor-pointer`}
                              >
                                {expandedCards[exp.id] ? (
                                  <><ChevronUp className="w-3 h-3" /> Lihat Lebih Sedikit</>
                                ) : (
                                  <><ChevronDown className="w-3 h-3" /> Selengkapnya</>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
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
