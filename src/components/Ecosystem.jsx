import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

const partners = ['SAP', 'Temenos', 'Tietoevry', 'Teradata', 'Nevis', 'MBME'];
const clients = ['Egypt Post', 'MCIT', 'H&D Bank', 'SC Zone', 'Egypt Trust', 'Maridive', 'Baheya', 'Prosecure'];
const frameworks = ['ITIL', 'COBIT', 'PMBOK', 'TOGAF', 'ISO 27001', 'PRINCE2'];

export const Ecosystem = () => {
  const { t } = useLang();
  const [revealRef, visible] = useReveal();

  const groups = [
    { title: t.ecosystem.providers, items: partners },
    { title: t.ecosystem.cloud, items: clients },
    { title: t.ecosystem.tools, items: frameworks },
  ];

  return (
    <section id="solutions" ref={revealRef} className="relative bg-slate-50 py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FFF4D6] text-[#8B6914] text-[11.5px] font-bold tracking-[0.18em] mb-4">
            {t.ecosystem.eyebrow}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-[#082D4A] tracking-[-0.03em] leading-[0.98]">
            {t.ecosystem.title}
          </h2>
          <p className="mt-5 text-[15px] text-slate-600 max-w-2xl leading-relaxed">{t.ecosystem.lede}</p>
        </div>

        <div className={`mb-6 p-8 rounded-2xl bg-white border border-slate-200 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-[11.5px] font-bold tracking-[0.14em] text-[#8B6914] mb-5">
            {t.ecosystem.featured}
          </div>
          <div className="flex flex-wrap items-center gap-5 justify-center">
            <div className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-2xl font-bold text-[#082D4A]" dir="ltr">
              SAP
            </div>
            <div className="text-slate-400 text-2xl">+</div>
            <div className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-2xl font-bold text-[#082D4A]" dir="ltr">
              Temenos
            </div>
          </div>
          <p className="mt-5 text-center text-[14px] text-slate-600">{t.ecosystem.featuredDesc}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {groups.map((g, i) => (
            <div
              key={i}
              className={`rounded-2xl bg-white border border-slate-200 p-6 ${visible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: `all 0.6s ${i * 100}ms` }}
            >
              <div className="text-[11px] font-bold tracking-[0.14em] text-[#1173BD] mb-4">{g.title}</div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it, j) => (
                  <span
                    key={j}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px] font-medium text-[#082D4A] hover:border-[#FFB814]/50 transition-colors"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
