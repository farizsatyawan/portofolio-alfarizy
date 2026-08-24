import { useState, useEffect } from 'react';
import { FolderKanban, Plus, Pencil, Trash2, X, Loader2, ExternalLink, GitBranch, ImageIcon } from 'lucide-react';
import API from '../../utils/api';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/projects/';
const emptyForm = { title: '', description: '', github_url: '', demo_url: '', tech_stack: '', image: null };

export default function KelolaProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditId(project.id);
    setForm({
      title: project.title || '',
      description: project.description || '',
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : (project.tech_stack || ''),
      image: null,
    });
    setPreview(project.image ? STORAGE_URL + project.image : null);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('github_url', form.github_url);
    fd.append('demo_url', form.demo_url);

    // Convert comma-separated tech_stack string to JSON array
    const techArray = form.tech_stack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    fd.append('tech_stack', JSON.stringify(techArray));

    if (form.image instanceof File) {
      fd.append('image', form.image);
    }

    try {
      if (editId) {
        await API.post(`/projects/${editId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await API.post('/projects', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus project ini?')) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus project.');
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-6 h-6 text-electric" />
              Kelola Projects
            </h1>
            <p className="text-gray-400 text-sm mt-1">{projects.length} project terdaftar</p>
          </div>
          <button onClick={openAdd} className="btn-glow text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Tambah Project
          </button>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-electric" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Belum ada project.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-400/30">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Image</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Tech Stack</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Links</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-400/20">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-5 py-3">
                        {p.image ? (
                          <img src={STORAGE_URL + p.image} alt={p.title} className="w-14 h-10 object-cover rounded-lg border border-dark-400/30" />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-dark-600 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-white">{p.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{p.description}</p>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(p.tech_stack) ? p.tech_stack : []).slice(0, 4).map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-electric/10 text-electric text-[11px] font-medium">{t}</span>
                          ))}
                          {(Array.isArray(p.tech_stack) ? p.tech_stack : []).length > 4 && (
                            <span className="px-2 py-0.5 rounded-md bg-dark-500 text-gray-400 text-[11px]">+{p.tech_stack.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {p.github_url && (
                            <a href={p.github_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><GitBranch className="w-4 h-4" /></a>
                          )}
                          {p.demo_url && (
                            <a href={p.demo_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-electric transition-colors"><ExternalLink className="w-4 h-4" /></a>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-dark-500/50 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
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

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => !saving && setModalOpen(false)} />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-800 border border-dark-400/30 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{editId ? 'Edit Project' : 'Tambah Project'}</h3>
              <button onClick={() => !saving && setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Judul Project *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Nama project"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Deskripsi singkat project"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm resize-none" />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Tech Stack</label>
                <input name="tech_stack" value={form.tech_stack} onChange={handleChange} placeholder="React, Laravel, MySQL (pisahkan dengan koma)"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">GitHub URL</label>
                  <input name="github_url" value={form.github_url} onChange={handleChange} placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Demo URL</label>
                  <input name="demo_url" value={form.demo_url} onChange={handleChange} placeholder="https://demo.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Screenshot Project</label>
                <input name="image" type="file" accept="image/*" onChange={handleChange}
                  className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-electric/15 file:text-electric hover:file:bg-electric/25 file:cursor-pointer cursor-pointer" />
                {preview && (
                  <img src={preview} alt="Preview" className="mt-3 w-full h-36 object-cover rounded-xl border border-dark-400/30" />
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-dark-600/50 hover:bg-dark-500/50 transition-colors disabled:opacity-50 cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="btn-glow text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editId ? 'Simpan Perubahan' : 'Tambah Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
