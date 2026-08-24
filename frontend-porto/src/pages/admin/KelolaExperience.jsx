import { useState, useEffect } from 'react';
import { Briefcase, Plus, Pencil, Trash2, X, Loader2, CalendarDays, GraduationCap, Users, Building2 } from 'lucide-react';
import API from '../../utils/api';

const emptyForm = { company: '', position: '', start_date: '', end_date: '', is_current: false, description: '', category: 'profesional' };

const CATEGORY_OPTIONS = [
  { value: 'pendidikan', label: 'Pendidikan', icon: GraduationCap, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { value: 'organisasi', label: 'Organisasi', icon: Users, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { value: 'profesional', label: 'Profesional', icon: Building2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
];

function getCategoryBadge(category) {
  const opt = CATEGORY_OPTIONS.find(o => o.value === category) || CATEGORY_OPTIONS[2];
  const Icon = opt.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${opt.color}`}>
      <Icon className="w-3 h-3" />
      {opt.label}
    </span>
  );
}

export default function KelolaExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await API.get('/experiences');
      setExperiences(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (exp) => {
    setEditId(exp.id);
    setForm({
      company: exp.company || '',
      position: exp.position || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || '',
      is_current: !!exp.is_current,
      description: exp.description || '',
      category: exp.category || 'profesional',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked, ...(checked ? { end_date: '' } : {}) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      company: form.company,
      position: form.position,
      start_date: form.start_date,
      end_date: form.is_current ? null : form.end_date,
      is_current: form.is_current,
      description: form.description,
      category: form.category,
    };

    try {
      if (editId) {
        await API.put(`/experiences/${editId}`, payload);
      } else {
        await API.post('/experiences', payload);
      }
      setModalOpen(false);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus experience ini?')) return;
    try {
      await API.delete(`/experiences/${id}`);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus experience.');
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-electric" />
              Kelola Experience
            </h1>
            <p className="text-gray-400 text-sm mt-1">{experiences.length} pengalaman terdaftar</p>
          </div>
          <button onClick={openAdd} className="btn-glow text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Tambah Experience
          </button>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-electric" /></div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Belum ada pengalaman.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-400/30">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Perusahaan</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Posisi</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Kategori</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Periode</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-400/20">
                  {experiences.map((exp) => (
                    <tr key={exp.id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-white">{exp.company}</td>
                      <td className="px-5 py-4 text-sm text-gray-300">{exp.position}</td>
                      <td className="px-5 py-4 text-sm hidden lg:table-cell">
                        {getCategoryBadge(exp.category)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">
                        {exp.start_date} - {exp.is_current ? 'Sekarang' : exp.end_date}
                      </td>
                      <td className="px-5 py-4 text-sm hidden sm:table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          exp.is_current ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}>
                          {exp.is_current ? 'Aktif' : 'Selesai'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(exp)} className="p-2 rounded-lg hover:bg-dark-500/50 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(exp.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => !saving && setModalOpen(false)} />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-800 border border-dark-400/30 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{editId ? 'Edit Experience' : 'Tambah Experience'}</h3>
              <button onClick={() => !saving && setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Kategori *</label>
                <select name="category" value={form.category} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm appearance-none cursor-pointer">
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama Perusahaan / Instansi *</label>
                <input name="company" value={form.company} onChange={handleChange} required placeholder="PT. Contoh Teknologi"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Posisi / Jabatan *</label>
                <input name="position" value={form.position} onChange={handleChange} required placeholder="Frontend Developer"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Tanggal Mulai *</label>
                  <input name="start_date" value={form.start_date} onChange={handleChange} required placeholder="Jan 2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Tanggal Selesai</label>
                  <input name="end_date" value={form.end_date} onChange={handleChange} disabled={form.is_current} placeholder="Des 2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="is_current" checked={form.is_current} onChange={handleChange}
                  className="w-4 h-4 rounded border-dark-400 bg-dark-700 text-electric focus:ring-electric/30 cursor-pointer" />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Masih bekerja di sini</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Jelaskan tanggung jawab & pencapaian..."
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-dark-600/50 hover:bg-dark-500/50 transition-colors disabled:opacity-50 cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="btn-glow text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editId ? 'Simpan Perubahan' : 'Tambah Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
