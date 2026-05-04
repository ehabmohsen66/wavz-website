import { useLang } from '../i18n/LangContext.jsx';

const logos = [
  'Egypt Post', 'MCIT', 'H&D Bank', 'Egypt Trust', 'Maridive',
  'La Poste', 'SC Zone', 'Prosecure', 'PFI', 'Baheya',
  'Tietoevry', 'Teradata',
];

export const LogoStrip = () => {
  const { lang } = useLang();

  return (
    <section className="relative bg-[#F8FAFC] border-t border-b border-slate-200/70 py-14 overflow-hidden">
      {/* Label */}
      <p className="text-center text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-8">
        {lang === 'ar'
          ? 'موثوق به من قِبَل كبرى المؤسسات في مصر والمنطقة'
          : "Trusted by Egypt's leading institutions & global partners"}
      </p>

      {/* Left fade */}
      <div
        className="absolute inset-y-0 start-0 w-28 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, white 60%, transparent)' }}
      />
      {/* Right fade */}
      <div
        className="absolute inset-y-0 end-0 w-28 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, white 60%, transparent)' }}
      />

      {/* Marquee */}
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-200 bg-white cursor-default"
            style={{
              minWidth: '130px',
              transition: 'border-color 150ms ease, background-color 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(17,115,189,0.35)'; e.currentTarget.style.backgroundColor = '#EEF6FF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            <span className="text-[13px] font-semibold text-slate-500 tracking-tight whitespace-nowrap">
              {logo}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
