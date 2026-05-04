import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { WavzWordmark } from './WavzLogo.jsx';

export const Footer = () => {
  const { t } = useLang();

  return (
    <footer className="relative bg-[#061E31] overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #97CFFA 1px, transparent 1px), linear-gradient(to bottom, #97CFFA 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Top border line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1173BD]/40 to-transparent" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-12 gap-8 pb-12 border-b border-white/8">

          {/* Brand column */}
          <div className="col-span-12 lg:col-span-4">
            {/* Logo — inverted to show white on dark */}
            <div className="brightness-0 invert opacity-90">
              <WavzWordmark />
            </div>
            <p className="mt-5 text-[13.5px] text-white/45 leading-[1.7] max-w-xs">
              The turn-key platform for enterprise digital transformation across MEA.
            </p>
            <div className="mt-6 space-y-2.5">
              <div className="flex items-start gap-2.5 text-[13px] text-white/50">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#1173BD]" />
                <span>{t.footer.address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-white/50" dir="ltr">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-[#1173BD]" />
                <span>{t.footer.phone}</span>
              </div>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 mt-5 text-[#FFB814] text-[13px] font-semibold hover:gap-2.5 transition-all duration-200"
            >
              {t.footer.contact} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Nav columns */}
          {t.footer.cols.map((col, i) => (
            <div key={i} className="col-span-6 lg:col-span-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-150"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 text-[11.5px] text-white/25">
          <div>{t.footer.copy}</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors duration-150">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white transition-colors duration-150">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
