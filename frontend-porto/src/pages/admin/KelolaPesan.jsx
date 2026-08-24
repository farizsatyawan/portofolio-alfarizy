import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Loader2, Mail, Search } from 'lucide-react';
import API from '../../utils/api';

export default function KelolaPesan() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await API.get('/contacts');
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    try {
      await API.delete(`/contacts/${id}`);
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus pesan.');
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-electric" />
            Pesan Masuk
          </h1>
          <p className="text-gray-400 text-sm mt-1">{messages.length} pesan diterima</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, email, atau subjek..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm"
        />
      </div>

      {/* Messages */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-electric" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{messages.length === 0 ? 'Belum ada pesan masuk.' : 'Tidak ada pesan yang cocok.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-400/20">
            {filtered.map((msg) => (
              <div key={msg.id} className="hover:bg-dark-700/20 transition-colors">
                <div
                  className="flex items-start gap-3 px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-electric/10 flex items-center justify-center text-sm font-bold text-electric uppercase shrink-0 mt-0.5">
                    {msg.name?.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{msg.name}</span>
                      <span className="text-xs text-gray-500">&lt;{msg.email}&gt;</span>
                    </div>
                    <p className="text-sm text-gray-300 font-medium mt-0.5">{msg.subject}</p>
                    {expanded !== msg.id && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{msg.message}</p>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-gray-600 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Message */}
                {expanded === msg.id && (
                  <div className="px-5 pb-4 pl-[68px]">
                    <div className="p-4 rounded-xl bg-dark-700/30 border border-dark-400/20 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
