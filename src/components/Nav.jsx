import { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useScrolled } from '../hooks/index.js';
import { WavzWordmark } from './WavzLogo.jsx';

export const Nav = () => {
  const { lang, setLang, t } = useLang();
  const scrolled = useScrolled(30);
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm'
          : 'bg-white/85 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <a href="#">
          <WavzWordmark />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {Object.entries(t.nav)
            .filter(([k]) => k !== 'cta' && k !== 'pricing')
            .map(([k, v]) => (
              <a
                key={k}
                href={`#${k}`}
                className="px-3.5 py-2 text-[14px] text-[#082D4A] hover:text-[#1173BD] hover:bg-slate-50 rounded-md transition-all duration-200"
              >
                {v}
              </a>
            ))}
          <a
            href="#about"
            className="px-3.5 py-2 text-[14px] text-[#082D4A] hover:text-[#1173BD] hover:bg-slate-50 rounded-md transition-all duration-200"
          >
            {t.nav.pricing}
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="hidden sm:flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-full border border-slate-200 text-[#082D4A] hover:border-[#1173BD] hover:text-[#1173BD] transition-all duration-200 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* CTA — yellow for visibility */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13.5px] bg-[#FFB814] text-[#082D4A] px-5 py-2.5 rounded-md hover:bg-[#F5A800] transition-colors font-bold shadow-sm shadow-[#FFB814]/30 cursor-pointer"
          >
            {t.nav.cta}
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#082D4A] p-1 cursor-pointer"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — animated slide-down */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-6 space-y-1 slide-down shadow-lg">
          {Object.entries(t.nav)
            .filter(([k]) => k !== 'cta')
            .map(([k, v]) => (
              <a
                key={k}
                href={`#${k}`}
                onClick={() => setOpen(false)}
                className="block text-[15px] text-[#082D4A] py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {v}
              </a>
            ))}
          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="text-[#1173BD] text-sm font-medium cursor-pointer"
            >
              {lang === 'en' ? 'عربي ←' : '→ English'}
            </button>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="bg-[#FFB814] text-[#082D4A] text-[13px] font-bold px-4 py-2 rounded-md"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
