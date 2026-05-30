import { useLang } from '../i18n/LangContext.jsx';

const logos = [
  { name: 'Egypt Post', src: '/EGYPT POST logo .png' },
  { name: 'MCIT', src: '/MCIT-logos-Color-English-02-white-bg (1).png', imgClass: 'h-10 scale-[1.35] hover:scale-150 mix-blend-multiply' },
  { name: 'H&D Bank', src: '/Housing and Development Bank logo .png' },
  { name: 'Egypt Trust', src: '/Egypt trust.png' },
  { name: 'Maridive', src: '/Maridive & Oil Services SAE Logo.png', imgClass: 'h-10 scale-125 hover:scale-[1.4]' },
  { name: 'La Poste', src: '/Logo-groupe-la-poste-2021.png' },
  { name: 'SC Zone', src: '/sc-zonelogo-header.png' },
  { name: 'Prosecure', src: '/ps9.jpeg', imgClass: 'h-10 scale-[1.35] hover:scale-150 mix-blend-multiply' },
  { name: 'Baheya', src: '/Baheya logo.png', imgClass: 'h-10 scale-[1.35] hover:scale-150 mix-blend-multiply' },
  { name: 'Tietoevry', src: '/8b56ffb305d960f5_org.png' },
  { name: 'Teradata', src: '/Teradata_logo_(2024).svg.png' },
  { name: 'Next Bank', src: '/nxt bank logo.jpg', imgClass: 'h-10 scale-[1.65] hover:scale-[1.8] mix-blend-multiply' },
  { name: 'PDC', src: '/PDC-Logo.png', imgClass: 'h-10 scale-[1.35] hover:scale-150 mix-blend-multiply' },
  { name: 'Detchland', src: '/detchland logo limited.png', imgClass: 'h-10 scale-[1.35] hover:scale-150 mix-blend-multiply' },
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
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-white cursor-default flex-shrink-0"
            style={{
              width: '180px',
              height: '80px',
              transition: 'border-color 150ms ease, background-color 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(17,115,189,0.35)'; e.currentTarget.style.backgroundColor = '#EEF6FF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            {logo.src ? (
              <img src={logo.src} alt={logo.name} className={`w-auto object-contain transition-transform duration-300 ${logo.imgClass || 'max-h-12 hover:scale-110'}`} />
            ) : (
              <span className="text-[13px] font-semibold text-slate-500 tracking-tight leading-tight text-center whitespace-pre-wrap">
                {logo.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
