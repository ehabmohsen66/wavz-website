import { LangProvider } from './i18n/LangContext.jsx';
import { Nav } from './components/Nav.jsx';
import { Hero } from './components/Hero.jsx';
import { LogoStrip } from './components/LogoStrip.jsx';
import { Offering } from './components/Offering.jsx';
import { Benchmark } from './components/Benchmark.jsx';
import { Platform } from './components/Platform.jsx';
import { Architecture } from './components/Architecture.jsx';
import { Results } from './components/Results.jsx';
import { Ecosystem } from './components/Ecosystem.jsx';
import { Comparison } from './components/Comparison.jsx';
import { FinalCTA } from './components/FinalCTA.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  return (
    <LangProvider>
      <Nav />
      <Hero />
      <LogoStrip />
      <Offering />
      <Benchmark />
      <Platform />
      <Architecture />
      <Results />
      <Ecosystem />
      <Comparison />
      <FinalCTA />
      <Footer />
    </LangProvider>
  );
}
