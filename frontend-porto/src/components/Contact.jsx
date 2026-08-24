import { useState } from 'react';
import { Send, Mail, MapPin, ArrowUp, Phone, Loader2 } from 'lucide-react';
import axios from 'axios';

/* Inline brand SVG icons since lucide-react v1.x removed brand icons */
function GithubIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('http://localhost:8000/api/contacts', formData);
      alert('Pesan berhasil dikirim!');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.message || 'Gagal mengirim pesan.');
    } finally {
      setSaving(false);
    }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/alfarizy-satyawan-ab093024a/', label: 'LinkedIn' },
    { icon: InstagramIcon, href: 'https://instagram.com/major_polindra', label: 'Instagram' },
    { icon: Mail, href: 'mailto:alfarizysatyawan123@gmail.com', label: 'Email' },
  ];

  return (
    <>
      <section id="contact" className="relative py-24 sm:py-32 bg-dark-800/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-electric text-sm font-semibold tracking-widest uppercase">
              Kontak
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 text-white">
              Mari <span className="gradient-text">Berkolaborasi</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Punya proyek yang ingin dikembangkan atau sekadar ingin berdiskusi?
              Saya senang mendengar dari Anda. Isi formulir di bawah atau hubungi melalui media sosial.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-electric to-blue-400 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card rounded-2xl p-6 space-y-6">
                <h3 className="text-white font-semibold text-lg">Hubungi Saya</h3>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-electric" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">Email</div>
                    <a href="mailto:alfarizysatyawan123@gmail.com" className="text-white text-sm hover:text-electric transition-colors">
                      alfarizysatyawan123@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-electric" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">Telepon</div>
                    <div className="text-white text-sm">+62 895-9631-21554</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-electric" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">Lokasi</div>
                    <div className="text-white text-sm">Tangerang, Banten, Indonesia</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Ikuti Saya</h3>
                <div className="flex gap-3">
                  {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-11 h-11 rounded-xl bg-dark-500 hover:bg-electric/20 border border-white/5 hover:border-electric/30 flex items-center justify-center text-gray-400 hover:text-electric transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                className="glass-card rounded-2xl p-6 sm:p-8 space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                      Nama Anda
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nama lengkap"
                      className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/5 text-white placeholder-gray-600 focus:border-electric/50 focus:ring-1 focus:ring-electric/30 focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email Anda
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@contoh.com"
                      className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/5 text-white placeholder-gray-600 focus:border-electric/50 focus:ring-1 focus:ring-electric/30 focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                    Subjek
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Judul / subjek pesan"
                    className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/5 text-white placeholder-gray-600 focus:border-electric/50 focus:ring-1 focus:ring-electric/30 focus:outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ceritakan tentang proyek Anda..."
                    className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/5 text-white placeholder-gray-600 focus:border-electric/50 focus:ring-1 focus:ring-electric/30 focus:outline-none transition-all text-sm resize-none"
                  />
                </div>

                <button
                  id="contact-submit"
                  type="submit"
                  disabled={saving}
                  className="btn-glow w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : submitted ? (
                    <>
                      Pesan Terkirim! ✓
                    </>
                  ) : (
                    <>
                      Kirim Pesan
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center font-bold text-white text-xs">
                A
              </div>
              <span className="text-sm text-gray-500">
                © {new Date().getFullYear()} Alfarizy Satyawan. Hak cipta dilindungi.
              </span>
            </div>

            <div className="flex items-center gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-600 hover:text-electric transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Kembali ke atas"
              className="w-9 h-9 rounded-lg bg-dark-500 hover:bg-electric/20 border border-white/5 hover:border-electric/30 flex items-center justify-center text-gray-400 hover:text-electric transition-all duration-300"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
