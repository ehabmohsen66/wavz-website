import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/index.js';

const partners = [
  { name: 'SAP', domain: 'sap.com' },
  { name: 'Temenos', domain: 'temenos.com' },
  { name: 'Backbase', domain: 'backbase.com', localSrc: '/backbase.png' },
  { name: 'Qlik', domain: 'qlik.com', localSrc: '/qlik.png' },
  { name: 'Tietoevry', domain: 'tietoevry.com', localSrc: '/8b56ffb305d960f5_org.png' },
  { name: 'Teradata', domain: 'teradata.com', localSrc: '/Teradata_logo_(2024).svg.png' },
  { name: 'Nevis', domain: 'nevis.net', localSrc: '/nevis_logo.png' },
  { name: 'MBME', domain: 'mbme.ae' }
];

const clients = [
  { name: 'Egypt Post', domain: 'egyptpost.org', localSrc: '/Picture8.png' },
  { name: 'AAIB', localSrc: '/Picture5.png' },
  { name: 'Bank NXT', localSrc: '/Picture6.png' },
  { name: 'EBank', localSrc: '/Picture7.png' },
  { name: 'Misr Insurance', localSrc: '/Picture4.png' },
  { name: 'DEPI', localSrc: '/Picture2.png' },
  { name: 'WASCO', localSrc: '/Picture3.png' },
  { name: 'Go Bus', localSrc: '/Picture1.png' },
  { name: 'Detchland', localSrc: '/detchland logo limited.png', imgClass: 'max-h-16 scale-[1.35] hover:scale-150 mix-blend-multiply' },
  { name: 'PDC', localSrc: '/PDC-Logo.png', imgClass: 'max-h-16 scale-[1.35] hover:scale-150 mix-blend-multiply' },
  { name: 'MCIT', domain: 'mcit.gov.eg', localSrc: '/MCIT-logos-Color-English-02-white-bg (1).png', imgClass: 'max-h-16 scale-[1.35] hover:scale-150 mix-blend-multiply' },
  { name: 'H&D Bank', domain: 'hdb-egy.com', localSrc: '/Housing and Development Bank logo .png' },
  { name: 'SC Zone', domain: 'sczone.eg', localSrc: '/sc-zonelogo-header.png' },
  { name: 'Egypt Trust', domain: 'egypttrust.com', localSrc: '/Egypt trust.png' },
  { name: 'Maridive', domain: 'maridivegroup.net', localSrc: '/Maridive & Oil Services SAE Logo.png', imgClass: 'max-h-16 scale-125 hover:scale-[1.4]' },
  { name: 'Baheya', domain: 'baheya.org', localSrc: '/Baheya logo.png', imgClass: 'max-h-16 scale-[1.35] hover:scale-150 mix-blend-multiply' },
  { name: 'Prosecure', domain: 'prosecureme.com', localSrc: '/ps9.jpeg', imgClass: 'max-h-16 scale-[1.35] hover:scale-150 mix-blend-multiply' }
];

const frameworks = [
  { name: 'ITIL', domain: 'axelos.com' },
  { name: 'COBIT', domain: 'isaca.org' },
  { name: 'PMBOK', domain: 'pmi.org' },
  { name: 'TOGAF', domain: 'opengroup.org' },
  { name: 'ISO 27001', domain: 'iso.org' },
  { name: 'PRINCE2', domain: 'axelos.com' }
];

const LogoBadge = ({ name, domain, localSrc, imgClass }) => {
  const [error, setError] = useState(false);
  
  const containerClass = "flex items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-[#FFB814]/50 transition-colors h-[96px] w-[220px] shadow-sm flex-shrink-0";

  if (error || (!domain && !localSrc)) {
    return (
      <div className={containerClass}>
        <span className="text-[13px] font-semibold text-slate-500 text-center tracking-tight leading-tight whitespace-pre-wrap">
          {name}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <img 
        src={localSrc || `https://logos.hunter.io/${domain}`} 
        alt={name} 
        title={name}
        className={`object-contain transition-transform duration-300 ${imgClass || 'max-h-16 max-w-[160px] hover:scale-110'}`}
        onError={() => setError(true)}
      />
    </div>
  );
};

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




        <div className="grid lg:grid-cols-3 gap-6">
          {groups.map((g, i) => (
            <div
              key={i}
              className={`rounded-2xl bg-white border border-slate-200 p-7 shadow-sm ${visible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: `all 0.6s ${i * 100}ms` }}
            >
              <div className="text-[12px] font-bold tracking-[0.14em] text-[#1173BD] mb-6">{g.title}</div>
              <div className="flex flex-wrap gap-3">
                {g.items.map((it, j) => (
                  <LogoBadge key={j} name={it.name} domain={it.domain} localSrc={it.localSrc} imgClass={it.imgClass} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
