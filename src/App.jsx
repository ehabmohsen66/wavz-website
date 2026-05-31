import { useState, useEffect } from 'react';
import { LangProvider } from './i18n/LangContext.jsx';
import { Nav } from './components/Nav.jsx';
import { Hero } from './components/Hero.jsx';
import { LogoStrip } from './components/LogoStrip.jsx';
import { Offering } from './components/Offering.jsx';
import { Benchmark } from './components/Benchmark.jsx';
import { Platform } from './components/Platform.jsx';
import { Architecture } from './components/Architecture.jsx';
import { Comparison } from './components/Comparison.jsx';
import { FinalCTA } from './components/FinalCTA.jsx';
import { Footer } from './components/Footer.jsx';
import { FlowArt, FlowSection } from './components/FlowArt.jsx';
import { SupportChat } from './components/SupportChat.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { WelcomeScreen } from './components/WelcomeScreen.jsx';
import { News } from './components/News.jsx';
import { About } from './components/About.jsx';
import { Journey } from './components/Journey.jsx';
import { Board } from './components/Board.jsx';
import { Team } from './components/Team.jsx';
import { Partners } from './components/Partners.jsx';
import { NotFound } from './components/NotFound.jsx';
import { ManagedServices } from './components/ManagedServices.jsx';
import { FinancialServices } from './components/FinancialServices.jsx';
import { PaymentServices } from './components/PaymentServices.jsx';
import { SapServices } from './components/SapServices.jsx';
import { DigitalTransformation } from './components/DigitalTransformation.jsx';
import { ContactPage } from './components/ContactPage.jsx';
import { BlogPage } from './components/BlogPage.jsx';
import { SavingsCalculator } from './components/SavingsCalculator.jsx';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  // Listen to browser hash changes for routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth scroll helper for landing anchors clicked from inner pages
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !hash.startsWith('#/news')) {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    }
  }, [currentRoute]);

  const isNewsroomRoute = currentRoute === '#/news';
  const isArticleRoute = currentRoute.startsWith('#/news/');
  const isAboutRoute   = currentRoute === '#/about';
  const isJourneyRoute = currentRoute === '#/journey';
  const isBoardRoute   = currentRoute === '#/board';
  const isTeamRoute     = currentRoute === '#/team';
  const isPartnersRoute  = currentRoute === '#/partners';
  const isManagedServicesRoute      = currentRoute === '#/managed-services';
  const isFinancialServicesRoute     = currentRoute === '#/financial-services';
  const isPaymentServicesRoute       = currentRoute === '#/payment-services';
  const isSapServicesRoute           = currentRoute === '#/sap-services';
  const isDigitalTransformRoute      = currentRoute === '#/digital-transformation';
  const isContactRoute               = currentRoute === '#/contact';
  const isBlogRoute                  = currentRoute === '#/blog' || currentRoute.startsWith('#/blog/');
  const isSavingsCalcRoute             = currentRoute === '#/savings-calculator';
  const isKnownRoute = [
    '#/', '#/about', '#/journey', '#/board', '#/team', '#/partners', '#/news',
    '#/managed-services', '#/financial-services', '#/payment-services',
    '#/sap-services', '#/digital-transformation', '#/contact', '#/blog', '#/savings-calculator'
  ].some(r => currentRoute === r || currentRoute.startsWith('#/news/') || currentRoute.startsWith('#/blog/'));

  // If on the dedicated about inner page
  if (isAboutRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div className="pt-28 pb-10 min-h-screen bg-[#F8FAFC]">
            <About />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Journey page route
  if (isJourneyRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div className="pt-28 pb-10 min-h-screen bg-[#F8FAFC]">
            <Journey />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Board of Directors page route
  if (isBoardRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div className="pt-28 pb-10 min-h-screen bg-[#F8FAFC]">
            <Board />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Executive Team page route
  if (isTeamRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div className="pt-28 pb-10 min-h-screen bg-[#F8FAFC]">
            <Team />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Managed Services page route
  if (isManagedServicesRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div style={{ paddingTop: '72px', minHeight: '100vh', background: '#061E31' }}>
            <ManagedServices />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Financial Services page route
  if (isFinancialServicesRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div style={{ paddingTop: '0', minHeight: '100vh', background: '#061E31' }}>
            <FinancialServices />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Payment Services page route
  if (isPaymentServicesRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div style={{ paddingTop: '0', minHeight: '100vh', background: '#061E31' }}>
            <PaymentServices />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // SAP Services page route
  if (isSapServicesRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div style={{ paddingTop: '0', minHeight: '100vh', background: '#061E31' }}>
            <SapServices />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Digital Transformation page route
  if (isDigitalTransformRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div style={{ paddingTop: '0', minHeight: '100vh', background: '#061E31' }}>
            <DigitalTransformation />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Contact page route
  if (isContactRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div style={{ paddingTop: '0', minHeight: '100vh', background: '#F8FAFC' }}>
            <ContactPage />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Blog page route
  if (isBlogRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div style={{ paddingTop: '0', minHeight: '100vh', background: '#F8FAFC' }}>
            <BlogPage route={currentRoute} />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Partners page route

  // Savings Calculator page route
  if (isSavingsCalcRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div style={{ paddingTop: '0', minHeight: '100vh', background: '#061E31' }}>
            <SavingsCalculator />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }


  if (isPartnersRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div className="pt-28 pb-10 min-h-screen bg-[#F8FAFC]">
            <Partners />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // If on a dedicated news inner page (either list or detail article)
  if (isNewsroomRoute || isArticleRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <div className="pt-28 pb-10 min-h-screen bg-[#F8FAFC]">
            <News route={currentRoute} />
          </div>
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // 404 — unrecognised hash route
  if (currentRoute.startsWith('#/') && !isKnownRoute) {
    return (
      <LangProvider>
        <ErrorBoundary>
          <Nav />
          <NotFound />
          <Footer />
          <SupportChat />
        </ErrorBoundary>
      </LangProvider>
    );
  }

  // Default: Main Landing Page

  return (
    <LangProvider>
      <ErrorBoundary>
        {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}
        <Nav />
        <FlowArt>
          <FlowSection>
            <Hero />
            <LogoStrip />
          </FlowSection>
          <FlowSection>
            <Offering />
          </FlowSection>
          <FlowSection>
            <Benchmark />
          </FlowSection>
          <FlowSection>
            <Platform />
          </FlowSection>
          <FlowSection>
            <Architecture />
          </FlowSection>
          <FlowSection>
            <News route={currentRoute} />
          </FlowSection>
          <FlowSection>
            <Comparison />
          </FlowSection>
          <FlowSection>
            <FinalCTA />
          </FlowSection>
        </FlowArt>
        <Footer />
        <SupportChat />
      </ErrorBoundary>
    </LangProvider>
  );
}
