import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Projects from './components/Projects.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

const student = {
  name: 'Jaymin Mandaliya',
  email: 'jayminmandaliya4@gmail.com',
  themeColor: '#e49b69',
  skills: ['React', 'JavaScript', 'HTML & CSS', 'Vite', 'Git & GitHub'],
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className={`app-shell${isDark ? ' theme-dark' : ''}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <NavBar isDark={isDark} onToggleTheme={() => setIsDark((current) => !current)} />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home name={student.name} themeColor={student.themeColor} skillList={student.skills} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact email={student.email} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer name={student.name} email={student.email} />
    </div>
  );
}
