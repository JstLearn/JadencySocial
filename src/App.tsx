import './i18n/index';
import './styles/globals.css';

import { Routes, Route } from 'react-router-dom';
import Cursor from './components/Cursor/Cursor';
import FloatingWhatsapp from './components/FloatingWhatsapp/FloatingWhatsapp';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import Navbar from './components/Navigation/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Stats from './components/Stats/Stats';
import Process from './components/Process/Process';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import ServiceDetail from './pages/services/ServiceDetail';

export default function App() {
  return (
    <div className="app">
      <ScrollProgress />
      <Cursor />
      <FloatingWhatsapp />
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <main>
              <Hero />
              <Services />
              <Stats />
              <Process />
              <CTA />
            </main>
            <Footer />
          </>
        } />
        <Route path="/hizmetler/:serviceKey" element={
          <>
            <Navbar />
            <main>
              <ServiceDetail />
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}
