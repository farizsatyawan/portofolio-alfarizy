import { useState, useEffect } from 'react';
import { Code2, Database, Layout, Smartphone, Globe, Cpu, BarChart3, Palette } from 'lucide-react';
import axios from 'axios';

const defaultSkills = [
  { icon: Globe, name: 'Laravel', level: 90 },
  { icon: Smartphone, name: 'Flutter / Dart', level: 85 },
  { icon: Code2, name: 'Python', level: 80 },
  { icon: Database, name: 'MySQL', level: 85 },
  { icon: Cpu, name: 'IoT / MQTT', level: 75 },
  { icon: BarChart3, name: 'Data Science', level: 75 },
  { icon: Layout, name: 'PHP / Laravel', level: 85 },
  { icon: Palette, name: 'Figma / UI-UX', level: 70 },
];

export default function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profiles');
        console.log("Data Profil untuk About:", response.data);
        
        const profileData = Array.isArray(response.data?.data)
          ? response.data.data[0]
          : response.data?.data;
          
        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error Fetching Profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section id="about" className="relative py-24 sm:py-32">
        <div className="flex justify-center items-center py-16">
          <p className="text-gray-400 text-sm tracking-wider animate-pulse">Loading data...</p>
        </div>
      </section>
    );
  }

  const headline = profile?.headline || 'Developer yang Antusias & Problem Solver';

  return (
    <section id="about" className="relative py-24 sm:py-32">
      {/* Section background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-500 text-sm font-semibold tracking-widest uppercase">Tentang Saya</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-white">
            {headline}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Bio Column - Personal Info Cards */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Informasi Personal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Lokasi', value: '📍 Tangerang, Banten' },
                { label: 'Pendidikan', value: '🎓 Politeknik Negeri Indramayu' },
                { label: 'Fokus', value: '🎯 Web, Mobile & IoT' },
                { label: 'Status', value: '📚 Mahasiswa Aktif' },
              ].map((info) => (
                <div
                  key={info.label}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 text-center hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="text-sm text-gray-500 mb-1.5">{info.label}</div>
                  <div className="text-white font-semibold text-sm">{info.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Code2 size={20} className="text-blue-500" />
              Keahlian Teknologi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultSkills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.name}
                    className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 group hover:border-blue-500/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Icon size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{skill.name}</div>
                        <div className="text-xs text-gray-500">{skill.level}%</div>
                      </div>
                    </div>
                    {/* Skill bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
