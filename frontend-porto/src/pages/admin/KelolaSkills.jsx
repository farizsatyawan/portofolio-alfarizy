import { useState, useEffect } from 'react';
import { Award, Plus, Pencil, Trash2, X, Loader2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import API from '../../utils/api';

const emptyForm = { name: '', issuer: '', category: '', link_sertifikat: '' };

export default function KelolaSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await API.get('/skills');
      setSkills(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditId(skill.id);
    setForm({
      name: skill.name || '',
      issuer: skill.issuer || '',
      category: skill.category || '',
      link_sertifikat: skill.link_sertifikat || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editId) {
        await API.put(`/skills/${editId}`, form);
      } else {
        await API.post('/skills', form);
      }
      closeModal();
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus sertifikasi ini?')) return;
    try {
      await API.delete(`/skills/${id}`);
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus sertifikasi.');
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-electric" />
              Kelola Sertifikasi
            </h1>
            <p className="text-gray-400 text-sm mt-1">{skills.length} sertifikasi terdaftar</p>
          </div>
          <button onClick={openAdd} className="btn-glow text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Tambah Sertifikasi
          </button>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-electric" /></div>
          ) : skills.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Belum ada sertifikasi.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-400/30">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama Sertifikat</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Penerbit</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Link Sertifikat</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-400/20">
                  {skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{skill.name}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-400 hidden md:table-cell">{skill.issuer || '-'}</td>
                      <td className="px-5 py-3.5 text-sm hidden sm:table-cell">
                        {skill.category ? (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400">
                            {skill.category}
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm hidden lg:table-cell">
                        {skill.link_sertifikat ? (
                          <a
                            href={skill.link_sertifikat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Lihat PDF
                          </a>
                        ) : (
                          <span className="text-gray-600 text-xs">Tidak ada</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(skill)} className="p-2 rounded-lg hover:bg-dark-500/50 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(skill.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
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
          <div className="absolute inset-0" onClick={closeModal} />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-800 border border-dark-400/30 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{editId ? 'Edit Sertifikasi' : 'Tambah Sertifikasi'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Sertifikat */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama Sertifikat *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Contoh: Data Science Fundamental"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
              </div>

              {/* Penerbit */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Penerbit (Issuer)</label>
                <input name="issuer" value={form.issuer} onChange={handleChange} placeholder="Contoh: Google, Dicoding, MySkill"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Kategori *</label>
                <input name="category" value={form.category} onChange={handleChange} required placeholder="Contoh: Frontend, Backend, Data Science, IoT"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
              </div>

              {/* Link Sertifikat (Google Drive) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Link Sertifikat (Google Drive)
                </label>
                <div className="relative">
                  <input name="link_sertifikat" type="url" value={form.link_sertifikat} onChange={handleChange} placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
                </div>
                {form.link_sertifikat && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <a href={form.link_sertifikat} target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-300 truncate">
                      Uji coba buka link sertifikat
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-dark-600/50 hover:bg-dark-500/50 transition-colors disabled:opacity-50 cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="btn-glow text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editId ? 'Simpan Perubahan' : 'Tambah Sertifikasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
