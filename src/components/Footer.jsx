import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { WavzWordmark } from './WavzLogo.jsx';

export const Footer = () => {
  const { t } = useLang();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-8 pb-12 border-b border-slate-200">
          <div className="col-span-12 lg:col-span-4">
            <WavzWordmark />
            <div className="mt-6 space-y-2 text-[13.5px] text-[#082D4A]/75">
              <div>{t.footer.address}</div>
              <div dir="ltr">{t.footer.phone}</div>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 mt-3 text-[#1173BD] font-semibold hover:gap-2.5 transition-all"
              >
                {t.footer.contact} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {t.footer.cols.map((col, i) => (
            <div key={i} className="col-span-6 lg:col-span-2">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#082D4A] mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a href="#" className="text-[13px] text-[#082D4A]/70 hover:text-[#1173BD] transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 text-[12px] text-[#082D4A]/55">
          <div>{t.footer.copy}</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#1173BD]">{t.footer.privacy}</a>
            <a href="#" className="hover:text-[#1173BD]">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
