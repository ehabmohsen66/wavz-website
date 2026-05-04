import { Check, X } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

export const Comparison = () => {
  const { t } = useLang();
  const [revealRef, visible] = useReveal();

  return (
    <section ref={revealRef} className="relative bg-white py-24 lg:py-32 border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1173BD]/20 bg-[#EEF6FF] text-[#1173BD] text-[11.5px] font-bold tracking-[0.16em] mb-4">
            {t.comparison.eyebrow}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-[#082D4A] tracking-[-0.03em] leading-[0.98]">
            {t.comparison.title}
          </h2>
          <p className="mt-4 text-[15px] text-slate-500">{t.comparison.subtitle}</p>
        </div>

        {/* Table with right-edge shadow for mobile scroll affordance */}
        <div
          className={`relative rounded-2xl border border-slate-200 overflow-hidden transition-all duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Mobile scroll hint shadow */}
          <div className="absolute inset-y-0 end-0 w-8 bg-gradient-to-l from-slate-200/40 to-transparent pointer-events-none z-10 md:hidden" />

          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]" dir="ltr">
              <thead>
                <tr className="bg-[#082D4A]">
                  {t.comparison.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`text-start p-4 lg:p-5 font-bold ${
                        i === 0
                          ? 'min-w-[260px] text-white/60 text-[12.5px] tracking-wide'
                          : i === 1
                          ? 'min-w-[110px] text-[#FFB814] bg-[#1173BD]'
                          : 'min-w-[100px] text-white/40'
                      }`}
                    >
                      {h}
                      {i === 1 && (
                        <span className="ms-2 text-[9px] bg-[#FFB814] text-[#082D4A] px-1.5 py-0.5 rounded font-black tracking-wider align-middle">
                          ✓ BEST
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                      visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                    style={{ transition: `opacity 0.5s ${i * 50 + 200}ms, transform 0.5s ${i * 50 + 200}ms` }}
                  >
                    <td className="p-4 lg:p-5 text-[#082D4A] font-medium text-[13.5px]">{row}</td>
                    {t.comparison.capabilities[i].map((cap, j) => (
                      <td
                        key={j}
                        className={`p-4 lg:p-5 ${j === 0 ? 'bg-[#EEF6FF]/60' : ''}`}
                      >
                        {cap ? (
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              j === 0
                                ? 'bg-[#1173BD] text-white'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                            <X className="w-3 h-3 text-slate-300" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
