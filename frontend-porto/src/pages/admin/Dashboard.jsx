import { useState, useEffect } from 'react';
import { FolderKanban, Award, Briefcase, MessageSquare, TrendingUp, Loader2, RefreshCcw } from 'lucide-react';
import API from '../../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [projects, skills, experiences, contacts] = await Promise.all([
        API.get('/projects'),
        API.get('/skills'),
        API.get('/experiences'),
        API.get('/contacts'),
      ]);
      setStats({
        projects: projects.data.data.length,
        skills: skills.data.data.length,
        experiences: experiences.data.data.length,
        messages: contacts.data.data.length,
      });
      setMessages(contacts.data.data.slice(0, 5));
    } catch {
      setStats({ projects: 0, skills: 0, experiences: 0, messages: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats?.projects, icon: FolderKanban, color: 'from-blue-500 to-cyan-400', glow: 'shadow-blue-500/20' },
    { label: 'Sertifikasi', value: stats?.skills, icon: Award, color: 'from-blue-600 to-indigo-500', glow: 'shadow-blue-500/20' },
    { label: 'Experiences', value: stats?.experiences, icon: Briefcase, color: 'from-emerald-500 to-teal-400', glow: 'shadow-emerald-500/20' },
    { label: 'Pesan Masuk', value: stats?.messages, icon: MessageSquare, color: 'from-amber-500 to-orange-400', glow: 'shadow-amber-500/20' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-electric" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Ringkasan data portofolio kamu</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-600/50 border border-dark-400/30 text-gray-300 hover:text-white hover:border-electric/30 transition-all duration-200 text-sm cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className={`glass-card rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.glow}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400 opacity-50" />
            </div>
            <p className="text-3xl font-bold text-white">{card.value ?? 0}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-electric" />
          Pesan Terbaru
        </h2>
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">Belum ada pesan masuk.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-dark-700/30 hover:bg-dark-700/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-electric/15 flex items-center justify-center text-xs font-bold text-electric uppercase shrink-0">
                  {msg.name?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">{msg.name}</span>
                    <span className="text-xs text-gray-500">{msg.email}</span>
                  </div>
                  <p className="text-sm text-gray-300 font-medium mt-0.5">{msg.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{msg.message}</p>
                </div>
                <span className="text-[10px] text-gray-600 shrink-0 whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
