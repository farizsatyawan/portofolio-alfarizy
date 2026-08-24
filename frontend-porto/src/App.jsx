import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experiences from './components/Experiences';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import KelolaHero from './pages/admin/KelolaHero';
import KelolaExperience from './pages/admin/KelolaExperience';
import KelolaSkills from './pages/admin/KelolaSkills';
import KelolaProjects from './pages/admin/KelolaProjects';
import KelolaPesan from './pages/admin/KelolaPesan';

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-100">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experiences />
        <Projects />
        <Certifications />
        <Contact />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portfolio Frontend */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hero" element={<KelolaHero />} />
          <Route path="experiences" element={<KelolaExperience />} />
          <Route path="skills" element={<KelolaSkills />} />
          <Route path="projects" element={<KelolaProjects />} />
          <Route path="messages" element={<KelolaPesan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
