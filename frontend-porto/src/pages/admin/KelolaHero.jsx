import { useState, useEffect } from 'react';
import { User, Save, Loader2, Upload, FileText, Trash2 } from 'lucide-react';
import API from '../../utils/api';

const STORAGE_URL = 'http://127.0.0.1:8000/storage/';

export default function KelolaHero() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    headline: '',
    sub_headline: '',
    description: '',
    github_link: '',
    linkedin_link: '',
    profile_photo: null,
    resume_pdf: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeName, setResumeName] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get('/profiles');
      const data = res.data.data;
      if (data.length > 0) {
        const p = data[0];
        setProfile(p);
        setForm({
          headline: p.headline || '',
          sub_headline: p.sub_headline || '',
          description: p.description || '',
          github_link: p.github_link || '',
          linkedin_link: p.linkedin_link || '',
          profile_photo: null,
          resume_pdf: null,
        });
        setPhotoPreview(p.profile_photo ? STORAGE_URL + 'profiles/' + p.profile_photo : null);
        setResumeName(p.resume_pdf || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_photo' && files?.[0]) {
      setForm({ ...form, profile_photo: files[0] });
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else if (name === 'resume_pdf' && files?.[0]) {
      setForm({ ...form, resume_pdf: files[0] });
      setResumeName(files[0].name);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    fd.append('headline', form.headline);
    fd.append('sub_headline', form.sub_headline);
    fd.append('description', form.description);
    fd.append('github_link', form.github_link);
    fd.append('linkedin_link', form.linkedin_link);
    if (form.profile_photo instanceof File) fd.append('profile_photo', form.profile_photo);
    if (form.resume_pdf instanceof File) fd.append('resume_pdf', form.resume_pdf);

    try {
      if (profile) {
        await API.post(`/profiles/${profile.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await API.post('/profiles', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await fetchProfile();
      alert('Profil berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-electric" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-electric" />
          Kelola Hero & About
        </h1>
        <p className="text-gray-400 text-sm mt-1">Data ini ditampilkan di bagian Hero dan About pada website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo & Resume Section */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Foto & Resume</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Foto Profil</label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border border-dark-400/30 shadow-lg" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-dark-600 flex items-center justify-center border border-dark-400/30">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric/15 text-electric text-sm font-medium hover:bg-electric/25 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Foto
                  <input name="profile_photo" type="file" accept="image/*" onChange={handleChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Resume / CV (PDF)</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-dark-600 flex flex-col items-center justify-center border border-dark-400/30 gap-1">
                  <FileText className="w-6 h-6 text-gray-500" />
                  {resumeName && <span className="text-[9px] text-gray-500 text-center px-1 truncate w-full">{resumeName}</span>}
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric/15 text-electric text-sm font-medium hover:bg-electric/25 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload PDF
                  <input name="resume_pdf" type="file" accept=".pdf" onChange={handleChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">Informasi Utama</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Headline *</label>
            <input name="headline" value={form.headline} onChange={handleChange} required placeholder="Hi, I'm John Doe"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Sub Headline</label>
            <input name="sub_headline" value={form.sub_headline} onChange={handleChange} placeholder="Full Stack Developer"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Deskripsi (About)</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Ceritakan tentang dirimu..."
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm resize-none" />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">GitHub</label>
              <input name="github_link" value={form.github_link} onChange={handleChange} placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">LinkedIn</label>
              <input name="linkedin_link" value={form.linkedin_link} onChange={handleChange} placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-700/50 border border-dark-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/30 transition-all text-sm" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="btn-glow text-white text-sm font-semibold px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </div>
  );
}
