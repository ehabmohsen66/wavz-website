import React from 'react';

// Light-weight replacements for shadcn components
const Card = ({ className, children }) => (
  <div className={`rounded-xl border bg-white text-slate-950 shadow-sm ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>
    {children}
  </div>
);

const Avatar = ({ className, children }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className }) => (
  <img className={`aspect-square h-full w-full ${className || ''}`} src={src} alt={alt} />
);

const AvatarFallback = ({ className, children }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-slate-100 font-medium text-slate-500 ${className || ''}`}>
    {children}
  </div>
);

import { useLang } from '../i18n/LangContext.jsx';
import { useTestimonials } from '../hooks/index.js';

const STATIC_TESTIMONIALS_EN = [
  {
    author: 'Edgars Bīberis',
    role: 'Regional Director of Business Development at Tietoevry',
    company: 'Tietoevry',
    logo: '/8b56ffb305d960f5_org.png',
    quote: '“Our partnership with WAVZ, brings new opportunities for growth and digital transformation in the region. With the global economy witnessing rapid development, it is crucial to have a partner that provides exceptional resources, expertise, and well-trained personnel who understand the local culture. This partnership strengthens our commitment to success and enables us to realize our vision for the region”',
    photo: '/Edgars-Biberis.jpg'
  },
  {
    author: 'Stephan Schweizer',
    role: 'CEO of Nevis Security AG',
    company: 'Nevis',
    logo: '/nevis_logo.png',
    quote: '“We support banks and financial service providers in the ME/A region in implementing a simple and secure solution for authenticating their customers. We look forward to building a global network of Partners. This is why we invest heavily in employees and partners like WAVZ, who bring the necessary expertise to build that global network”',
    photo: '/Stephen01.jpg.webp'
  },
  {
    author: 'Khaled Hammouda',
    role: 'General Manager at Teradata Egypt',
    company: 'Teradata',
    logo: '/Teradata_logo_(2024).svg.png',
    quote: '“At Teradata, we know that people thrive when empowered with trusted information. We are excited to begin working with WAVZ and leverage their expertise in the Egyptian market to bring Teradata’s innovative platform and Trusted AI capabilities to local businesses.”',
    photo: '/Khaled-Hammouda.jpg'
  }
];

const STATIC_TESTIMONIALS_AR = [
  {
    author: 'إدغارز بيبريس',
    role: 'المدير الإقليمي لتطوير الأعمال في Tietoevry',
    company: 'Tietoevry',
    logo: '/8b56ffb305d960f5_org.png',
    quote: '“إن شراكتنا مع WAVZ تجلب فرصاً جديدة للنمو والتحول الرقمي في المنطقة. مع ما يشهده الاقتصاد العالمي من تطور متسارع، من المهم للغاية وجود شريك يوفر موارد استثنائية وخبرات وكوادر مدربة تفهم الثقافة المحلية. تعزز هذه الشراكة التزامنا بالنجاح وتمكننا من تحقيق رؤيتنا للمنطقة”',
    photo: '/Edgars-Biberis.jpg'
  },
  {
    author: 'ستيفان شوايتزر',
    role: 'الرئيس التنفيذي لشركة Nevis Security AG',
    company: 'Nevis',
    logo: '/nevis_logo.png',
    quote: '“نحن ندعم البنوك ومزودي الخدمات المالية في منطقة الشرق الأوسط وأفريقيا لتطبيق حلول بسيطة وآمنة لمصادقة عملائهم. نتطلع لبناء شبكة عالمية من الشركاء، ولهذا نستثمر بقوة في الموظفين والشركاء مثل WAVZ الذين يجلبون الخبرة اللازمة لبناء تلك الشبكة”',
    photo: '/Stephen01.jpg.webp'
  },
  {
    author: 'خالد حمودة',
    role: 'المدير العام لشركة Teradata مصر',
    company: 'Teradata',
    logo: '/Teradata_logo_(2024).svg.png',
    quote: '“في Teradata، نعلم أن الناس يزدهرون عندما يتم تمكينهم بالمعلومات الموثوقة. نحن متحمسون للبدء بالعمل مع WAVZ والاستفادة من خبراتهم في السوق المصري لجلب منصة Teradata المبتكرة وقدرات الذكاء الاصطناعي الموثوقة للشركات المحلية.”',
    photo: '/Khaled-Hammouda.jpg'
  }
];

const mapDbTestimonial = (dbTest, ar) => {
  let photoUrl = dbTest.photo || '';
  if (photoUrl && !photoUrl.startsWith('http') && !photoUrl.startsWith('data:')) {
    const backendBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
    photoUrl = `${backendBase}${photoUrl}`;
  }

  let logoUrl = '';
  const comp = (dbTest.company || '').toLowerCase();
  if (comp.includes('tietoevry')) logoUrl = '/8b56ffb305d960f5_org.png';
  else if (comp.includes('nevis')) logoUrl = '/nevis_logo.png';
  else if (comp.includes('teradata')) logoUrl = '/Teradata_logo_(2024).svg.png';

  const author = ar ? dbTest.author_ar : dbTest.author_en;
  const quote = ar ? dbTest.quote_ar : dbTest.quote_en;
  const role = ar ? dbTest.title_ar : dbTest.title_en;

  return {
    author: author,
    role: role,
    company: dbTest.company,
    logo: logoUrl,
    quote: quote ? (quote.startsWith('“') ? quote : `“${quote}”`) : '',
    photo: photoUrl
  };
};

export const PartnerTestimonials = () => {
    const { lang, dir } = useLang();
    const ar = lang === 'ar';

    const { data: dbTestimonials } = useTestimonials([]);

    const testimonials = (dbTestimonials && dbTestimonials.length > 0)
      ? dbTestimonials.map(t => mapDbTestimonial(t, ar))
      : (ar ? STATIC_TESTIMONIALS_AR : STATIC_TESTIMONIALS_EN);

    return (
        <section className="py-16 md:py-32 bg-slate-50" dir={dir}>
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-4xl font-medium lg:text-5xl text-[#082D4A]" style={{ fontFamily: ar ? "'Tajawal', sans-serif" : "'Outfit', sans-serif" }}>
                        {ar ? 'آراء بعض شركائنا الاستراتيجيين' : 'Some of Our Partner Testimonials'}
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {testimonials.map((test, index) => {
                        const isLarge = index === 0;
                        const initials = (test.author || '')
                          .replace(/^(Mr\.|Dr\.|Mrs\.|السيد|الدكتور|الدكتورة)\s+/i, '')
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map(w => w[0])
                          .join('');

                        return (
                            <Card 
                                key={index} 
                                className={`flex flex-col gap-8 border-slate-200 h-full ${
                                    isLarge ? 'sm:col-span-2 sm:p-6 lg:row-span-2' : 'md:col-span-2'
                                }`}
                            >
                                <CardHeader className={isLarge ? 'pb-0 sm:p-0' : 'pb-2'}>
                                    {test.logo ? (
                                        <img
                                            className="h-6 w-fit opacity-70 object-contain"
                                            src={test.logo}
                                            alt={`${test.company} Logo`}
                                            height="24"
                                            width="auto"
                                        />
                                    ) : (
                                        <span className="text-xs font-black text-slate-400 tracking-wider uppercase">{test.company}</span>
                                    )}
                                </CardHeader>
                                <CardContent className={`${isLarge ? 'sm:p-0' : 'pt-2'} flex-1 flex flex-col justify-between`}>
                                    <blockquote className="flex flex-col justify-between h-full gap-6">
                                        <p className="text-xl font-medium text-slate-800 leading-relaxed" style={{ fontFamily: ar ? "'Tajawal', sans-serif" : "'Outfit', sans-serif" }}>
                                            {test.quote}
                                        </p>

                                        <div className="flex items-center gap-3 mt-4">
                                            {test.photo ? (
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={test.photo} alt={test.author} />
                                                    <AvatarFallback>{initials}</AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <Avatar className="h-12 w-12 flex items-center justify-center bg-slate-100 font-bold text-slate-500">
                                                    {initials}
                                                </Avatar>
                                            )}

                                            <div>
                                                <cite className="text-sm font-bold text-slate-900 not-italic" style={{ fontFamily: ar ? "'Tajawal', sans-serif" : "'Outfit', sans-serif" }}>
                                                    {test.author}
                                                </cite>
                                                <span className="text-slate-500 block text-sm" style={{ fontFamily: ar ? "'Tajawal', sans-serif" : "'Outfit', sans-serif" }}>
                                                    {test.role}
                                                </span>
                                            </div>
                                        </div>
                                    </blockquote>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

