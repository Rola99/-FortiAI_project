import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlayerPage from './pages/PlayerPage';
import CoachPage from './pages/CoachPage';
import MedicalPage from './pages/MedicalPage';
import './App.css';
import logo from './assets/logo.png';

function Home() {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const sectionRef = useRef(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowCategories(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategories = () =>
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="home-container">
      <div className="hero-container">
        {/* صورة الهيرو */}
        <img
          src={require('./assets/data-analytics-in-sports.jpg')}
          alt="Hero"
          className="hero-image"
        />
        {/* اللوجو */}
        <img src={logo} alt="Logo" className="hero-logo" />
        {/* الخلفية المظللة */}
        <div className="hero-overlay" />
        {/* الشعار الكبير */}
        <div className="hero-text">FortAI | حصن</div>
        {/* زر ابدأ */}
        <button className="cta-button" onClick={scrollToCategories}>
          ابدأ الآن
        </button>
      </div>

      {/* قسم التصنيفات */}
      <div ref={sectionRef} className="categories-section">
        <h2>اختر نوع المستخدم</h2>
        <div className="buttons-group">
          <button onClick={() => navigate('/player')}>لاعب</button>
          <button onClick={() => navigate('/coach')}>مدرب</button>
          <button onClick={() => navigate('/medical')}>فريق طبي</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/coach" element={<CoachPage />} />
        <Route path="/medical" element={<MedicalPage />} />
      </Routes>
    </Router>
  );
}
