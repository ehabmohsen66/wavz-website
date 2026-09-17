import { useState, useRef, useEffect } from 'react';
import { Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useScrolled } from '../hooks/index.js';
import { WavzWordmark } from './WavzLogo.jsx';

/* ── Dropdown menu component ── */
const Dropdown = ({ label, items, lang }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isAr = lang === 'ar';

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3.5 py-2 text-[14px] text-[#082D4A] hover:text-[#1173BD] hover:bg-slate-50 rounded-md transition-all duration-200 cursor-pointer"
        style={{ fontWeight: 500 }}
      >
        {label}
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className="absolute top-full pt-1 z-50"
        style={{
          left: isAr ? 'auto' : 0,
          right: isAr ? 0 : 'auto',
          minWidth: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 160ms ease, transform 160ms ease',
        }}
      >
        <div
          className="rounded-xl overflow-hidden shadow-lg"
          style={{
            background: 'rgba(255,255,255,0.98)',
            border: '1px solid rgba(17,115,189,0.12)',
            boxShadow: '0 8px 30px rgba(8,45,74,0.12)',
          }}
        >
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-[#082D4A] hover:text-[#1173BD] hover:bg-slate-50 transition-colors duration-150"
              style={{ fontWeight: 500, textDecoration: 'none' }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main Nav ── */
export const Nav = () => {
  const { lang, setLang, t } = useLang();
  const scrolled = useScrolled(30);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);
  const isAr = lang === 'ar';

  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 170);
  };

  /* ── Dropdown item definitions ── */
  const aboutItems = [
    { href: '#/about',   label: isAr ? 'عن الشركة'       : 'About Us' },
    { href: '#/board',   label: isAr ? 'مجلس الإدارة'     : 'Board of Directors' },
    { href: '#/team',    label: isAr ? 'فريقنا التنفيذي'  : 'Our Executive Team' },
  ];

  const ENABLE_CUSTOMER_STORIES = false;

  const mediaItems = [
    { href: '#/news',                  label: isAr ? 'المركز الإعلامي' : 'Media Center' },
    { href: '#/news/press-releases',   label: isAr ? 'البيانات الصحفية' : 'Press Releases' },
    ...(ENABLE_CUSTOMER_STORIES ? [{ href: '#/news/client-stories', label: isAr ? 'قصص النجاح' : 'Success Stories' }] : []),
    { href: '#/news/insights',         label: isAr ? 'رؤى وقيادة فكرية' : 'Insights' },
    { href: '#/news/events',           label: isAr ? 'الفعاليات' : 'Events' },
    { href: '#/news/social',           label: isAr ? 'وسائل التواصل' : 'Social Media' },
    { href: '#/blog',                  label: isAr ? 'المدونة' : 'Blog' },
  ];


  const solutionsItems = [
    { href: '#/managed-services',   label: isAr ? 'الخدمات المُدارة'             : 'Managed Services' },
    { href: '#/sap-services',       label: isAr ? 'حلول وخدمات SAP'         : 'SAP Solutions & Services' },
    { href: '#/oracle-solutions',   label: isAr ? 'حلول Oracle التقنية'     : 'Oracle Technology Solutions' },
    { href: '#/data-ai',            label: isAr ? 'حلول البيانات والذكاء الاصطناعي' : 'Data & AI Solutions' },
  ];


  return (
    <header
      className={`fixed z-50 transition-all duration-300 ${
        scrolled
          ? 'top-0 sm:top-4 inset-x-0 sm:inset-x-6 lg:inset-x-8 max-w-[1400px] mx-auto bg-white/95 backdrop-blur-xl border-b sm:border border-slate-200/60 shadow-md sm:rounded-2xl'
          : 'top-0 sm:top-5 inset-x-0 sm:inset-x-6 lg:inset-x-8 max-w-[1400px] mx-auto bg-white/75 hover:bg-white/95 backdrop-blur-lg border-b sm:border border-white/50 shadow-sm sm:rounded-2xl'
      }`}
    >
      <div className="px-6 lg:px-8 py-3.5 flex items-center justify-between w-full">
        <a href="#">
          <WavzWordmark />
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-0.5">

          {/* Home */}
          <a
            href="#"
            className="px-3.5 py-2 text-[14px] text-[#082D4A] hover:text-[#1173BD] hover:bg-slate-50 rounded-md transition-all duration-200"
            style={{ fontWeight: 500 }}
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </a>

          {/* About WAVZ dropdown */}
          <Dropdown
            label={isAr ? 'عن WAVZ' : 'About WAVZ'}
            items={aboutItems}
            lang={lang}
          />

          {/* Our Partners */}
          <a
            href="#/partners"
            className="px-3.5 py-2 text-[14px] text-[#082D4A] hover:text-[#1173BD] hover:bg-slate-50 rounded-md transition-all duration-200"
            style={{ fontWeight: 500 }}
          >
            {isAr ? 'شركاؤنا' : 'Our Partners'}
          </a>

          {/* Solutions & Services dropdown */}
          <Dropdown
            label={isAr ? 'الحلول والخدمات' : 'Solutions & Services'}
            items={solutionsItems}
            lang={lang}
          />

          {/* Media Center dropdown */}
          <Dropdown
            label={isAr ? 'المركز الإعلامي' : 'Media Center'}
            items={mediaItems}
            lang={lang}
          />

          {/* Contact Us */}
          <a
            href="#/contact"
            className="px-3.5 py-2 text-[14px] text-[#082D4A] hover:text-[#1173BD] hover:bg-slate-50 rounded-md transition-all duration-200"
            style={{ fontWeight: 500 }}
          >
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </a>

        </nav>

        <div className="flex items-center gap-2.5">
          <div className="relative group hidden sm:block">
            <button
              type="button"
              disabled
              aria-label="قريباً"
              className="flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full border border-slate-200 text-slate-400 bg-slate-50/80 cursor-not-allowed select-none opacity-80"
            >
              <svg width="15" height="11" viewBox="0 0 3 2" style={{ borderRadius: 1.5, display: 'inline-block', flexShrink: 0, boxShadow: '0 0 1px rgba(0,0,0,0.2)', opacity: 0.7 }}>
                <rect width="3" height="2" fill="#fff" />
                <rect width="3" height="0.67" fill="#C11B17" />
                <rect y="1.33" width="3" height="0.67" fill="#000" />
                <polygon points="1.4,0.9 1.6,0.9 1.5,1.1" fill="#C29B38" />
              </svg>
              <span style={{ fontWeight: 600 }}>عربي</span>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50 whitespace-nowrap">
              <div className="bg-[#082D4A] text-white text-[11.5px] font-medium px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                <span>قريباً</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href="#/contact"
            className="press-scale hidden sm:inline-flex items-center gap-1.5 text-[13.5px] bg-[#FFB814] text-[#082D4A] px-5 py-2.5 rounded-md font-bold shadow-sm shadow-[#FFB814]/30 cursor-pointer"
            style={{ transition: 'transform 120ms cubic-bezier(0.23,1,0.32,1), background-color 150ms ease' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5A800'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFB814'}
          >
            {t.nav.cta}
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => open ? closeMenu() : setOpen(true)}
            className="press-scale lg:hidden text-[#082D4A] p-1 cursor-pointer"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {(open || closing) && (
        <div className={`lg:hidden bg-white/98 backdrop-blur-xl border-t border-slate-100/50 px-5 py-5 shadow-lg sm:rounded-b-2xl ${
          closing ? 'slide-up' : 'slide-down'
        }`}>

          {/* Home */}
          <a
            href="#"
            onClick={closeMenu}
            className="flex items-center text-[15px] text-[#082D4A] py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </a>

          {/* About WAVZ accordion */}
          <div>
            <button
              onClick={() => setMobileAboutOpen((v) => !v)}
              className="w-full flex items-center justify-between text-[15px] text-[#082D4A] py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              <span>{isAr ? 'عن WAVZ' : 'About WAVZ'}</span>
              <ChevronDown
                className="w-4 h-4 text-slate-400 transition-transform duration-200"
                style={{ transform: mobileAboutOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {mobileAboutOpen && (
              <div className="ps-4 pb-1 space-y-0.5">
                {aboutItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center text-[14px] text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#1173BD] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Our Partners */}
          <a
            href="#/partners"
            onClick={closeMenu}
            className="flex items-center text-[15px] text-[#082D4A] py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            {isAr ? 'شركاؤنا' : 'Our Partners'}
          </a>

          {/* Solutions & Services accordion */}
          <div>
            <button
              onClick={() => setMobileSolutionsOpen((v) => !v)}
              className="w-full flex items-center justify-between text-[15px] text-[#082D4A] py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              <span>{isAr ? 'الحلول والخدمات' : 'Solutions & Services'}</span>
              <ChevronDown
                className="w-4 h-4 text-slate-400 transition-transform duration-200"
                style={{ transform: mobileSolutionsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {mobileSolutionsOpen && (
              <div className="ps-4 pb-1 space-y-0.5">
                {solutionsItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center text-[14px] text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#1173BD] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Media Center accordion */}
          <div>
            <button
              onClick={() => setMobileMediaOpen((v) => !v)}
              className="w-full flex items-center justify-between text-[15px] text-[#082D4A] py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors font-medium cursor-pointer"
            >
              <span>{isAr ? 'المركز الإعلامي' : 'Media Center'}</span>
              <ChevronDown
                className="w-4 h-4 text-slate-400 transition-transform duration-200"
                style={{ transform: mobileMediaOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {mobileMediaOpen && (
              <div className="ps-4 pb-1 space-y-0.5">
                {mediaItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center text-[14px] text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#1173BD] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Contact Us */}
          <a
            href="#/contact"
            onClick={closeMenu}
            className="flex items-center text-[15px] text-[#082D4A] py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </a>

          {/* Bottom row — lang + CTA */}
          <div className="pt-4 mt-1 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium cursor-not-allowed select-none">
              <span>عربي</span>
              <span className="text-[11px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-normal">
                (قريباً)
              </span>
            </div>
            <a
              href="#/contact"
              onClick={closeMenu}
              className="press-scale bg-[#FFB814] text-[#082D4A] text-[13px] font-bold px-4 py-2 rounded-md"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
