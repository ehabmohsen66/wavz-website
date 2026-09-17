import { useEffect } from 'react';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.wavz.com';
const DEFAULT_IMAGE = `${BASE_URL}/WavzIcon.png`;

const SEO_MAP = {
  '#/': {
    title: 'WAVZ for Digital Transformation | IT Managed Services & Solutions',
    description:
      'WAVZ is the trusted IT managed services and digital transformation partner for banks, ministries, and large enterprises across the Middle East and Africa.',
    keywords:
      'digital transformation, IT managed services, enterprise IT, Middle East, Africa, cloud services, SAP, Oracle, fintech',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/about': {
    title: 'About WAVZ for Digital Transformation | Our Mission, Vision & Values',
    description:
      'Learn about WAVZ for Digital Transformation — a leading technology company delivering multi-industry, multi-service, multi-geography IT solutions across MEA.',
    keywords: 'about WAVZ, digital transformation company, IT company Egypt, MEA technology',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/journey': {
    title: 'Our Journey | WAVZ for Digital Transformation',
    description:
      'Explore WAVZ\'s growth story — from a regional IT integrator to a full-scale digital transformation powerhouse serving enterprises across the Middle East and Africa.',
    keywords: 'WAVZ history, company journey, IT growth MEA, digital transformation milestones',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/board': {
    title: 'Board of Directors | WAVZ for Digital Transformation',
    description:
      'Meet the WAVZ Board of Directors — experienced leaders guiding strategy and governance for enterprise digital transformation across MEA.',
    keywords: 'WAVZ board, board of directors, leadership, governance, digital transformation',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/team': {
    title: 'Executive Team | WAVZ for Digital Transformation',
    description:
      'Meet the WAVZ executive leadership team driving innovation, delivery, and growth across managed services, cloud, fintech, and enterprise solutions.',
    keywords: 'WAVZ team, executive team, leadership, C-suite, IT management',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/partners': {
    title: 'Our Partners | WAVZ for Digital Transformation',
    description:
      'WAVZ partners with world-class technology vendors including Oracle, SAP, Teradata, and more to deliver best-in-class enterprise solutions.',
    keywords: 'WAVZ partners, Oracle partner, SAP partner, technology alliances, IT partnerships MEA',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/news': {
    title: 'Newsroom | WAVZ for Digital Transformation',
    description:
      'Stay updated with WAVZ press releases, success stories, industry insights, events, and social media updates from across the MEA region.',
    keywords: 'WAVZ news, press releases, digital transformation news, IT news MEA, WAVZ events',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/blog': {
    title: 'Blog | WAVZ for Digital Transformation',
    description:
      'Read expert articles, technical insights, and thought leadership on digital transformation, cloud, AI, fintech, SAP, Oracle, and managed services.',
    keywords: 'WAVZ blog, digital transformation articles, IT insights, cloud blog, AI enterprise',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/managed-services': {
    title: 'Managed IT Services | WAVZ for Digital Transformation',
    description:
      'WAVZ Managed Services deliver 24/7 infrastructure monitoring, NOC operations, cybersecurity, and IT support for enterprises across MEA.',
    keywords:
      'managed IT services, NOC, 24/7 monitoring, infrastructure management, cybersecurity, MEA managed services',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/financial-services': {
    title: 'Financial Services Solutions | WAVZ for Digital Transformation',
    description:
      'WAVZ delivers core banking, digital banking, payments, and compliance technology solutions for banks and financial institutions across MEA.',
    keywords:
      'financial services IT, core banking, digital banking, payments technology, banking solutions MEA',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/payment-services': {
    title: 'Payment Services & Fintech Solutions | WAVZ for Digital Transformation',
    description:
      'End-to-end payment infrastructure, switching, card management, and fintech solutions by WAVZ for banks, telcos, and fintechs in the MEA region.',
    keywords:
      'payment services, fintech, card management, payment switching, digital payments MEA, WAVZ payments',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/sap-services': {
    title: 'SAP Services & Implementation | WAVZ for Digital Transformation',
    description:
      'Certified SAP implementation, migration, support, and managed services by WAVZ — helping enterprises modernise ERP across the Middle East and Africa.',
    keywords:
      'SAP services, SAP implementation, SAP support, SAP partner MEA, ERP transformation, WAVZ SAP',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/digital-transformation': {
    title: 'Digital Transformation Services | WAVZ for Digital Transformation',
    description:
      'WAVZ accelerates enterprise digital transformation through cloud adoption, automation, AI, and platform modernisation across MEA industries.',
    keywords:
      'digital transformation, cloud adoption, enterprise automation, AI transformation, IT modernisation MEA',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/oracle-solutions': {
    title: 'Oracle Technology Solutions | WAVZ for Digital Transformation',
    description:
      'WAVZ is a certified Oracle partner delivering database, cloud infrastructure, ERP, and HCM solutions to enterprises in the Middle East and Africa.',
    keywords:
      'Oracle solutions, Oracle partner, Oracle ERP, Oracle Cloud, Oracle database MEA, WAVZ Oracle',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/data-ai': {
    title: 'Data & AI Solutions | WAVZ for Digital Transformation',
    description:
      'WAVZ Data & AI solutions help enterprises unlock insights, automate decisions, and drive growth through advanced analytics, ML, and AI platforms.',
    keywords:
      'data analytics, AI solutions, machine learning, enterprise AI, business intelligence MEA, WAVZ AI',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/contact': {
    title: 'Contact Us | WAVZ for Digital Transformation',
    description:
      'Get in touch with WAVZ — reach our sales, support, and partnerships teams for enterprise IT solutions across the Middle East and Africa.',
    keywords: 'contact WAVZ, WAVZ support, IT consultation, enterprise contact, MEA IT company',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
  '#/savings-calculator': {
    title: 'IT Savings Calculator | WAVZ for Digital Transformation',
    description:
      'Estimate how much your enterprise can save by moving to WAVZ Managed Services. Calculate ROI on IT outsourcing in minutes.',
    keywords:
      'IT savings calculator, managed services ROI, IT outsourcing savings, WAVZ calculator, enterprise IT cost',
    image: DEFAULT_IMAGE,
    type: 'website',
  },
};

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

function setStructuredData(data) {
  let el = document.querySelector('script[data-seo="wavz-org"]');
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-seo', 'wavz-org');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSEO(route) {
  useEffect(() => {
    // Resolve route — strip article slugs back to parent key
    let key = route || '#/';
    if (key.startsWith('#/news/') || key === '#/news') key = '#/news';
    if (key.startsWith('#/blog/') || key === '#/blog') key = '#/blog';

    const seo = SEO_MAP[key] || SEO_MAP['#/'];
    const pageUrl = `${BASE_URL}/${key.replace('#/', '')}`;

    // Title
    document.title = seo.title;

    // Standard meta
    setMeta('description', seo.description);
    setMeta('keywords', seo.keywords);
    setMeta('robots', 'index, follow');
    setMeta('author', 'WAVZ for Digital Transformation');

    // Open Graph
    setMeta('og:title', seo.title, 'property');
    setMeta('og:description', seo.description, 'property');
    setMeta('og:type', seo.type || 'website', 'property');
    setMeta('og:url', pageUrl, 'property');
    setMeta('og:image', seo.image || DEFAULT_IMAGE, 'property');
    setMeta('og:image:width', '512', 'property');
    setMeta('og:image:height', '512', 'property');
    setMeta('og:site_name', 'WAVZ for Digital Transformation', 'property');
    setMeta('og:locale', 'en_US', 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', seo.image || DEFAULT_IMAGE);
    setMeta('twitter:site', '@wavz_official');

    // Canonical
    setCanonical(pageUrl);

    // Organization structured data (homepage only)
    if (key === '#/') {
      setStructuredData({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'WAVZ for Digital Transformation',
        url: BASE_URL,
        logo: `${BASE_URL}/Logo.png`,
        sameAs: [],
        description:
          'WAVZ is the trusted IT managed services and digital transformation partner for banks, ministries, and large enterprises across the Middle East and Africa.',
        areaServed: ['Middle East', 'Africa'],
        knowsAbout: [
          'Managed IT Services',
          'Digital Transformation',
          'SAP Services',
          'Oracle Solutions',
          'Financial Services Technology',
          'Payment Services',
          'Data & AI',
          'Cloud Infrastructure',
        ],
      });
    }
  }, [route]);
}
