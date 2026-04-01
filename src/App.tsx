import './i18n/index';
import './styles/globals.css';

import Cursor from './components/Cursor/Cursor';
import FloatingWhatsapp from './components/FloatingWhatsapp/FloatingWhatsapp';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import Navbar from './components/Navigation/Navbar';
import Hero from './components/Hero/Hero';
import ClientTicker from './components/ClientTicker/ClientTicker';
import Services from './components/Services/Services';
import Stats from './components/Stats/Stats';
import Process from './components/Process/Process';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <div className="app">
      <ScrollProgress />
      <Cursor />
      <FloatingWhatsapp />
      <Navbar />
      <main>
        <Hero />
        <ClientTicker />
        <Services />
        <Stats />
        <Process />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
