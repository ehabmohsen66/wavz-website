import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowLeft, Search, Calendar, Clock, ChevronRight, ChevronLeft, User } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import blogData from './blog_contents_multilang.json';
import { MeshGradient } from '@paper-design/shaders-react';
import { SearchBar } from './SearchBar.jsx';
import { useBlog } from '../hooks/index.js';

const mapDbPostToPost = (dbPost) => {
  const dateObj = new Date(dbPost.published_at || dbPost.created_at);
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const dateArStr = `${dateObj.getDate()} ${arMonths[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  let imageUrl = dbPost.image || '';
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    const backendBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
    imageUrl = `${backendBase}${imageUrl}`;
  }

  return {
    id: dbPost.id,
    slug: dbPost.slug,
    title: dbPost.title_en,
    titleAr: dbPost.title_ar,
    date: dateStr,
    dateAr: dateArStr,
    category: dbPost.category_en || 'General',
    categoryAr: dbPost.category_ar || 'عام',
    readTime: String(dbPost.read_time || '5'),
    excerpt: dbPost.excerpt_en,
    excerptAr: dbPost.excerpt_ar,
    url: `#/blog/${dbPost.slug}`,
    image: imageUrl,
    accent: dbPost.accent_color || '#FFB814',
    tag: dbPost.tags || 'News',
    blocks_en: dbPost.blocks_en || [],
    blocks_ar: dbPost.blocks_ar || []
  };
};


/* ─── Design tokens ─── */
const T = {
  navy:   '#061E31',
  navy2:  '#082D4A',
  navy3:  '#0d3a5e',
  gold:   '#FFB814',
  goldD:  '#F5A800',
  blue:   '#1173BD',
  white:  '#F0F4F8',
  muted:  'rgba(145,196,245,0.62)',
  dim:    'rgba(145,196,245,0.22)',
  border: 'rgba(255,255,255,0.07)',
};

const FONT    = "'Outfit', system-ui, sans-serif";
const FONT_AR = "'Tajawal', sans-serif";

/* ─── Blog posts with real scraped images ─── */
const POSTS = [
  {
    id: 1,
    title: 'AI & Customer Service: Ethical Dilemmas in 2025',
    titleAr: '\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0648\u062e\u062f\u0645\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621: \u0627\u0644\u0645\u0639\u0636\u0644\u0627\u062a \u0627\u0644\u0623\u062e\u0644\u0627\u0642\u064a\u0629 \u0641\u064a 2025',
    date: 'Dec 24, 2024', dateAr: '24 \u062f\u064a\u0633\u0645\u0628\u0631 2024',
    category: 'AI & Innovation', categoryAr: '\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a',
    readTime: '6',
    excerpt: 'Artificial Intelligence is reshaping industries, and customer service is no exception. With AI-powered chatbots, predictive analytics, and natural language processing, businesses are revolutionizing how they engage with customers.',
    excerptAr: '\u064a\u064f\u0639\u064a\u062f \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u062a\u0634\u0643\u064a\u0644 \u0627\u0644\u0635\u0646\u0627\u0639\u0627\u062a\u060c \u0648\u062e\u062f\u0645\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0644\u064a\u0633\u062a \u0627\u0633\u062a\u062b\u0646\u0627\u0621\u064b.',
    url: 'https://wavz.com.eg/ai-customer-service-ethical-dilemmas/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/12/Ai1-400x250.png',
    accent: T.gold, tag: 'AI',
  },
  {
    id: 2,
    title: 'SOC Strategies 2025: Trends to Fortify Cyber Resilience',
    titleAr: '\u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a\u0627\u062a SOC 2025: \u0627\u062a\u062c\u0627\u0647\u0627\u062a \u0644\u062a\u0639\u0632\u064a\u0632 \u0627\u0644\u0645\u0631\u0648\u0646\u0629 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',
    date: 'Dec 17, 2024', dateAr: '17 \u062f\u064a\u0633\u0645\u0628\u0631 2024',
    category: 'Cybersecurity', categoryAr: '\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
    readTime: '8',
    excerpt: "In today's hyperconnected world, cyber threats have escalated from sporadic nuisances to relentless, sophisticated campaigns targeting organizations of all sizes. A robust Security Operations Center is no longer a luxury.",
    excerptAr: '\u0641\u064a \u0639\u0627\u0644\u0645\u0646\u0627 \u0627\u0644\u0645\u062a\u0631\u0627\u0628\u0637 \u0627\u0644\u064a\u0648\u0645\u060c \u062a\u0635\u0627\u0639\u062f\u062a \u0627\u0644\u062a\u0647\u062f\u064a\u062f\u0627\u062a \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u0645\u0646 \u0645\u062c\u0631\u062f \u0625\u0632\u0639\u0627\u062c \u0625\u0644\u0649 \u062d\u0645\u0644\u0627\u062a \u0645\u062a\u0637\u0648\u0631\u0629.',
    url: 'https://wavz.com.eg/mastering-soc-strategies-in-2025-emerging-trends-to-fortify-your-cyber-resilience/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/12/SC1-400x250.png',
    accent: '#EF4444', tag: 'SOC',
  },
  {
    id: 3,
    title: 'The Future of SAP ERP: Trends Shaping Enterprise Resource Planning in 2025',
    titleAr: '\u0645\u0633\u062a\u0642\u0628\u0644 SAP ERP: \u0627\u0644\u0627\u062a\u062c\u0627\u0647\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u064f\u0634\u0643\u0651\u0644 \u062a\u062e\u0637\u064a\u0637 \u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0645\u0624\u0633\u0633\u0629 \u0641\u064a 2025',
    date: 'Dec 10, 2024', dateAr: '10 \u062f\u064a\u0633\u0645\u0628\u0631 2024',
    category: 'SAP Services', categoryAr: '\u062e\u062f\u0645\u0627\u062a SAP',
    readTime: '7',
    excerpt: 'SAP ERP has become synonymous with streamlined operations and intelligent decision-making. As businesses prepare for 2025, the evolution of SAP ERP is setting the stage for a transformative era.',
    excerptAr: '\u0623\u0635\u0628\u062d SAP ERP \u0645\u0631\u0627\u062f\u0641\u0627\u064b \u0644\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u0645\u0628\u0633\u0637\u0629 \u0648\u0635\u0646\u0639 \u0627\u0644\u0642\u0631\u0627\u0631 \u0627\u0644\u0630\u0643\u064a.',
    url: 'https://wavz.com.eg/the-future-of-sap-erp-trends-shaping-enterprise-resource-planning-in-2025/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/12/al1-400x250.png',
    accent: T.blue, tag: 'SAP',
  },
  {
    id: 4,
    title: 'Top 5 Digital Transformation Trends Every Business Must Embrace in 2025',
    titleAr: '\u0623\u0647\u0645 5 \u0627\u062a\u062c\u0627\u0647\u0627\u062a \u0644\u0644\u062a\u062d\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u064a \u064a\u062c\u0628 \u0639\u0644\u0649 \u0643\u0644 \u0634\u0631\u0643\u0629 \u062a\u0628\u0646\u0651\u064a\u0647\u0627 \u0641\u064a 2025',
    date: 'Dec 3, 2024', dateAr: '3 \u062f\u064a\u0633\u0645\u0628\u0631 2024',
    category: 'Digital Transformation', categoryAr: '\u0627\u0644\u062a\u062d\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u064a',
    readTime: '5',
    excerpt: 'Digital transformation continues to redefine how businesses operate, innovate, and compete. In 2025, staying ahead in this ever-evolving landscape requires proactive engagement with emerging trends.',
    excerptAr: '\u064a\u0648\u0627\u0635\u0644 \u0627\u0644\u062a\u062d\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u064a \u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u0631\u064a\u0641 \u0643\u064a\u0641\u064a\u0629 \u0639\u0645\u0644 \u0627\u0644\u0634\u0631\u0643\u0627\u062a \u0648\u0627\u0628\u062a\u0643\u0627\u0631\u0647\u0627.',
    url: 'https://wavz.com.eg/top-5-digital-transformation-trends-every-business-must-embrace-in-2025/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/12/20251-400x250.png',
    accent: '#22C55E', tag: 'DX',
  },
  {
    id: 5,
    title: 'AI and the Future of Managed Services: A Look Ahead',
    titleAr: '\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0648\u0645\u0633\u062a\u0642\u0628\u0644 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u064f\u062f\u0627\u0631\u0629',
    date: 'Nov 26, 2024', dateAr: '26 \u0646\u0648\u0641\u0645\u0628\u0631 2024',
    category: 'Managed Services', categoryAr: '\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u064f\u062f\u0627\u0631\u0629',
    readTime: '6',
    excerpt: 'Artificial Intelligence has evolved from an experimental technology to a transformative tool, revolutionizing industries worldwide. For managed services, AI offers a new way to enhance efficiency and improve decision-making.',
    excerptAr: '\u062a\u0637\u0648\u0631 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0645\u0646 \u062a\u0642\u0646\u064a\u0629 \u062a\u062c\u0631\u064a\u0628\u064a\u0629 \u0625\u0644\u0649 \u0623\u062f\u0627\u0629 \u062a\u062d\u0648\u064a\u0644\u064a\u0629.',
    url: 'https://wavz.com.eg/ai-and-the-future-of-managed-services-a-look-ahead/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/11/aii1-400x250.png',
    accent: T.gold, tag: 'AI',
  },
  {
    id: 6,
    title: 'T24: The Future of Banking in Egypt with WAVZ',
    titleAr: 'T24: \u0645\u0633\u062a\u0642\u0628\u0644 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0635\u0631\u0641\u064a\u0629 \u0641\u064a \u0645\u0635\u0631 \u0645\u0639 WAVZ',
    date: 'Nov 19, 2024', dateAr: '19 \u0646\u0648\u0641\u0645\u0628\u0631 2024',
    category: 'Financial Services', categoryAr: '\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629',
    readTime: '7',
    excerpt: "In Egypt's rapidly evolving financial landscape, the demand for agile and innovative banking solutions has reached new heights. Banks and institutions seek ways to enhance operational efficiency and meet regulatory requirements.",
    excerptAr: '\u0641\u064a \u0627\u0644\u0645\u0634\u0647\u062f \u0627\u0644\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u062a\u0637\u0648\u0631 \u0628\u0633\u0631\u0639\u0629 \u0641\u064a \u0645\u0635\u0631\u060c \u0628\u0644\u063a \u0627\u0644\u0637\u0644\u0628 \u0639\u0644\u0649 \u062d\u0644\u0648\u0644 \u0645\u0635\u0631\u0641\u064a\u0629 \u0645\u0631\u0646\u0629 \u0648\u0645\u0628\u062a\u0643\u0631\u0629 \u0622\u0641\u0627\u0642\u0627\u064b \u062c\u062f\u064a\u062f\u0629.',
    url: 'https://wavz.com.eg/t24-the-future-of-banking-in-egypt/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/11/T24-400x250.png',
    accent: T.blue, tag: 'FinTech',
  },
  {
    id: 7,
    title: 'The Future of Cloud Computing: Trends and Predictions for 2024 and Beyond',
    titleAr: '\u0645\u0633\u062a\u0642\u0628\u0644 \u0627\u0644\u062d\u0648\u0633\u0628\u0629 \u0627\u0644\u0633\u062d\u0627\u0628\u064a\u0629: \u0627\u0644\u0627\u062a\u062c\u0627\u0647\u0627\u062a \u0648\u0627\u0644\u062a\u0648\u0642\u0639\u0627\u062a',
    date: 'Nov 12, 2024', dateAr: '12 \u0646\u0648\u0641\u0645\u0628\u0631 2024',
    category: 'Cloud', categoryAr: '\u0627\u0644\u0633\u062d\u0627\u0628\u0629 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',
    readTime: '6',
    excerpt: 'Cloud computing continues to evolve at a rapid pace, transforming how organizations store, process, and access data. The trends shaping cloud infrastructure today will define the digital economy of tomorrow.',
    excerptAr: '\u062a\u062a\u0637\u0648\u0631 \u0627\u0644\u062d\u0648\u0633\u0628\u0629 \u0627\u0644\u0633\u062d\u0627\u0628\u064a\u0629 \u0628\u0648\u062a\u064a\u0631\u0629 \u0633\u0631\u064a\u0639\u0629\u060c \u0645\u064f\u062d\u0648\u0650\u0651\u0644\u0629\u064b \u0637\u0631\u064a\u0642\u0629 \u062a\u062e\u0632\u064a\u0646 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0645\u0639\u0627\u0644\u062c\u062a\u0647\u0627.',
    url: 'https://wavz.com.eg/the-future-of-cloud-computing-trends-and-predictions-for-2024-and-beyond/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/11/Cloud1-400x250.png',
    accent: '#A855F7', tag: 'Cloud',
  },
  {
    id: 8,
    title: 'How Augmented Reality is Revolutionizing Customer Experience in Fintech',
    titleAr: '\u0643\u064a\u0641 \u062a\u064f\u062d\u062f\u062b \u0627\u0644\u0648\u0627\u0642\u0639 \u0627\u0644\u0645\u0639\u0632\u0632 \u062b\u0648\u0631\u0629 \u0641\u064a \u062a\u062c\u0631\u0628\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0641\u064a \u0627\u0644\u0642\u0637\u0627\u0639 \u0627\u0644\u0645\u0627\u0644\u064a',
    date: 'Nov 5, 2024', dateAr: '5 \u0646\u0648\u0641\u0645\u0628\u0631 2024',
    category: 'FinTech', categoryAr: '\u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 \u0627\u0644\u0645\u0627\u0644\u064a\u0629',
    readTime: '5',
    excerpt: 'Augmented Reality is rapidly emerging as a game-changer in the fintech sector, offering innovative ways to enhance customer experience, improve financial literacy, and streamline complex financial processes.',
    excerptAr: '\u064a\u0628\u0631\u0632 \u0627\u0644\u0648\u0627\u0642\u0639 \u0627\u0644\u0645\u0639\u0632\u0632 \u0628\u0633\u0631\u0639\u0629 \u0628\u0648\u0635\u0641\u0647 \u0645\u062d\u0631\u0643\u0627\u064b \u0644\u0644\u062a\u063a\u064a\u064a\u0631 \u0641\u064a \u0642\u0637\u0627\u0639 \u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 \u0627\u0644\u0645\u0627\u0644\u064a\u0629.',
    url: 'https://wavz.com.eg/how-augmented-reality-is-revolutionizing-customer-experience-in-fintech/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/11/AR1-400x250.png',
    accent: '#F97316', tag: 'AR',
  },
  {
    id: 9,
    title: 'Comprehensive IT Testing Services for Reliable Business Systems',
    titleAr: '\u062e\u062f\u0645\u0627\u062a \u0627\u062e\u062a\u0628\u0627\u0631 IT \u0627\u0644\u0634\u0627\u0645\u0644\u0629 \u0644\u0623\u0646\u0638\u0645\u0629 \u0623\u0639\u0645\u0627\u0644 \u0645\u0648\u062b\u0648\u0642\u0629',
    date: 'Oct 29, 2024', dateAr: '29 \u0623\u0643\u062a\u0648\u0628\u0631 2024',
    category: 'IT Testing', categoryAr: '\u0627\u062e\u062a\u0628\u0627\u0631 IT',
    readTime: '5',
    excerpt: 'Reliable IT systems are the backbone of modern business. Comprehensive testing services ensure your systems perform flawlessly, scale efficiently, and remain secure in the face of evolving threats.',
    excerptAr: '\u0623\u0646\u0638\u0645\u0629 \u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0648\u062b\u0648\u0642\u0629 \u0647\u064a \u0627\u0644\u0639\u0645\u0648\u062f \u0627\u0644\u0641\u0642\u0631\u064a \u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u0623\u0639\u0645\u0627\u0644.',
    url: 'https://wavz.com.eg/comprehensive-it-testing-services-for-reliable-business-systems/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/10/IT1-400x250.png',
    accent: '#22C55E', tag: 'Testing',
  },
  {
    id: 10,
    title: 'The Rise of Managed Services Solutions in Egypt',
    titleAr: '\u0635\u0639\u0648\u062f \u062d\u0644\u0648\u0644 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u064f\u062f\u0627\u0631\u0629 \u0641\u064a \u0645\u0635\u0631',
    date: 'Oct 22, 2024', dateAr: '22 \u0623\u0643\u062a\u0648\u0628\u0631 2024',
    category: 'Managed Services', categoryAr: '\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u064f\u062f\u0627\u0631\u0629',
    readTime: '6',
    excerpt: "Egypt's digital economy is accelerating, and with it comes a growing demand for professional managed services. Managed service providers offer the expertise, scalability, and reliability organizations need.",
    excerptAr: '\u064a\u062a\u0633\u0627\u0631\u0639 \u0627\u0644\u0627\u0642\u062a\u0635\u0627\u062f \u0627\u0644\u0631\u0642\u0645\u064a \u0641\u064a \u0645\u0635\u0631\u060c \u0648\u0645\u0639\u0647 \u064a\u062a\u0632\u0627\u064a\u062f \u0627\u0644\u0637\u0644\u0628 \u0639\u0644\u0649 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u064f\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0647\u0646\u064a\u0629.',
    url: 'https://wavz.com.eg/the-rise-of-managed-services-solutions-in-egypt/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/10/MS1-400x250.png',
    accent: T.gold, tag: 'Egypt',
  },
  {
    id: 11,
    title: "AI in Cybersecurity: Protecting Egypt's Digital Economy",
    titleAr: '\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0641\u064a \u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a: \u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0627\u0642\u062a\u0635\u0627\u062f \u0627\u0644\u0631\u0642\u0645\u064a',
    date: 'Oct 15, 2024', dateAr: '15 \u0623\u0643\u062a\u0648\u0628\u0631 2024',
    category: 'Cybersecurity', categoryAr: '\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
    readTime: '7',
    excerpt: "As Egypt's digital economy grows, so do cybersecurity challenges. AI-powered security solutions are emerging as essential tools for detecting, preventing, and responding to sophisticated cyber threats.",
    excerptAr: '\u0645\u0639 \u0646\u0645\u0648 \u0627\u0644\u0627\u0642\u062a\u0635\u0627\u062f \u0627\u0644\u0631\u0642\u0645\u064a \u0641\u064a \u0645\u0635\u0631\u060c \u062a\u062a\u0632\u0627\u064a\u062f \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a \u0627\u0644\u0623\u0645\u0646\u064a\u0629 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629.',
    url: 'https://wavz.com.eg/ai-in-cybersecurity-protecting-egypts-digital-economy/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/10/Ai1-400x250.png',
    accent: '#EF4444', tag: 'Security',
  },
  {
    id: 12,
    title: 'The Role of APIs in Open Banking: Driving Innovation',
    titleAr: '\u062f\u0648\u0631 API \u0641\u064a \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0635\u0631\u0641\u064a\u0629 \u0627\u0644\u0645\u0641\u062a\u0648\u062d\u0629: \u0642\u064a\u0627\u062f\u0629 \u0627\u0644\u0627\u0628\u062a\u0643\u0627\u0631',
    date: 'Oct 8, 2024', dateAr: '8 \u0623\u0643\u062a\u0648\u0628\u0631 2024',
    category: 'Financial Services', categoryAr: '\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629',
    readTime: '5',
    excerpt: 'Open Banking is transforming financial services by enabling secure data sharing between banks and third-party providers through APIs, driving unprecedented levels of competition, collaboration, and customer-centric services.',
    excerptAr: '\u062a\u064f\u062d\u0648\u0651\u0644 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0635\u0631\u0641\u064a\u0629 \u0627\u0644\u0645\u0641\u062a\u0648\u062d\u0629 \u0635\u0646\u0627\u0639\u0629 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0645\u0646 \u062e\u0644\u0627\u0644 \u062a\u0645\u0643\u064a\u0646 \u062a\u0628\u0627\u062f\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0628\u0634\u0643\u0644 \u0622\u0645\u0646.',
    url: 'https://wavz.com.eg/the-role-of-apis-in-open-banking-driving-innovation/',
    image: 'https://wavz.com.eg/wp-content/uploads/2024/10/Open1-400x250.png',
    accent: T.blue, tag: 'Open Banking',
  },
];

const POSTS_WITH_SLUGS = POSTS.map(post => {
  const slug = post.url.replace('https://wavz.com.eg/', '').split('/')[0];
  return { ...post, slug };
});

const ALL_CATS_EN = ['All', 'AI & Innovation', 'Cybersecurity', 'SAP Services', 'Digital Transformation', 'Managed Services', 'Financial Services', 'Cloud', 'FinTech', 'IT Testing'];
const ALL_CATS_AR = ['\u0627\u0644\u0643\u0644', '\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a', '\u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a', '\u062e\u062f\u0645\u0627\u062a SAP', '\u0627\u0644\u062a\u062d\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u064a', '\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u064f\u062f\u0627\u0631\u0629', '\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629', '\u0627\u0644\u0633\u062d\u0627\u0628\u0629', '\u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 \u0627\u0644\u0645\u0627\u0644\u064a\u0629', '\u0627\u062e\u062a\u0628\u0627\u0631 IT'];

/* ─── Featured card (first post) ─── */
const FeaturedCard = ({ post, ar, font }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.a
      ref={ref}
      href={`#/blog/${post.slug}`}
      className="featured-grid"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: T.navy2,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
      whileHover={{ borderColor: 'rgba(255,184,20,0.3)' }}
    >
      {/* Left: content */}
      <div style={{
        background: `linear-gradient(135deg, ${T.navy3} 0%, ${T.navy2} 100%)`,
        padding: '40px 36px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: 300, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20,
          right: ar ? 'auto' : -20, left: ar ? -20 : 'auto',
          fontSize: 120, fontWeight: 900, letterSpacing: '-0.06em',
          color: 'rgba(255,255,255,0.03)', fontFamily: font, lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>{post.tag}</div>

        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 4,
            background: `${post.accent}18`, border: `1px solid ${post.accent}44`,
            marginBottom: 18,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: post.accent, fontFamily: font }}>
              {ar ? '\u2726 \u0645\u0645\u064a\u0632' : '\u2726 FEATURED'}
            </span>
          </div>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(18px,2.2vw,26px)', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.025em', color: T.white, margin: '0 0 14px' }}>
            {ar ? post.titleAr : post.title}
          </h2>
          <p style={{ fontFamily: font, fontSize: 14, lineHeight: 1.7, color: T.muted, margin: 0 }}>
            {ar ? post.excerptAr : post.excerpt}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.muted }}>
            <Calendar size={13} />
            <span style={{ fontFamily: font, fontSize: 12 }}>{ar ? post.dateAr : post.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.muted }}>
            <Clock size={13} />
            <span style={{ fontFamily: font, fontSize: 12 }}>{post.readTime} {ar ? '\u062f\u0642\u0627\u0626\u0642 \u0642\u0631\u0627\u0621\u0629' : 'min read'}</span>
          </div>
        </div>
      </div>

      {/* Right: real image */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 300 }}>
        <img
          src={post.image}
          alt={post.title}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.55s ease',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        {/* Blend gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: ar
            ? 'linear-gradient(to left, transparent 50%, rgba(8,45,74,0.55) 100%)'
            : 'linear-gradient(to right, transparent 50%, rgba(8,45,74,0.55) 100%)',
        }} />
        {/* Read CTA chip */}
        <div style={{
          position: 'absolute', bottom: 24,
          right: ar ? 'auto' : 24, left: ar ? 24 : 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 16px 8px 8px',
          background: 'rgba(6,30,49,0.72)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.18)', borderRadius: 100,
          color: T.white, fontFamily: font, fontSize: 13, fontWeight: 600,
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: '50%',
            background: post.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', flexShrink: 0,
          }}>
            <ArrowRight size={14} />
          </span>
          {ar ? '\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0642\u0627\u0644' : 'Read article'}
        </div>
      </div>
    </motion.a>
  );
};

/* ─── Regular post card ─── */
const PostCard = ({ post, ar, font, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.a
      ref={ref}
      href={`#/blog/${post.slug}`}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="hover-lift"
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#ffffff', border: '1px solid rgba(17,115,189,0.12)',
        borderRadius: 12, overflow: 'hidden',
        textDecoration: 'none', cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(8,45,74,0.04)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(17,115,189,0.3)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(8,45,74,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(17,115,189,0.12)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(8,45,74,0.04)';
      }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            transition: 'transform 0.45s ease',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 10,
          left: ar ? 'auto' : 10, right: ar ? 10 : 'auto',
          padding: '3.5px 10px', borderRadius: 4,
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          border: `1px solid ${post.accent}44`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <span style={{ fontFamily: font, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: post.accent }}>
            {ar ? post.categoryAr : post.category}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{
          fontFamily: font, fontSize: 'clamp(14px,1.4vw,16px)', fontWeight: 700,
          lineHeight: 1.35, letterSpacing: '-0.015em',
          color: '#082D4A', margin: 0,
        }}>
          {ar ? post.titleAr : post.title}
        </h3>
        <p style={{
          fontFamily: font, fontSize: 12.5, lineHeight: 1.7, color: '#475569', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {ar ? post.excerptAr : post.excerpt}
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(17,115,189,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b' }}>
            <Calendar size={11} style={{ color: '#94a3b8' }} />
            <span style={{ fontFamily: font, fontSize: 11 }}>{ar ? post.dateAr : post.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1173BD', fontSize: 11, fontFamily: font, fontWeight: 600 }}>
            {ar ? 'اقرأ المزيد' : 'Read more'}
            <ChevronRight size={13} />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

/* ─── Blog Post Detail View ─── */
const BlogDetailView = ({ post, ar, font, allPosts = [] }) => {
  const content = post.blocks_en || post.blocks_ar ? post : blogData[post.slug];
  const blocks = ar ? (content?.blocks_ar || content?.ar_blocks || content?.en_blocks || content?.blocks_en) : (content?.blocks_en || content?.en_blocks || content?.ar_blocks || content?.blocks_ar);

  const related = allPosts.length > 0
    ? allPosts.filter(p => p.slug !== post.slug).slice(0, 3)
    : POSTS_WITH_SLUGS.filter(p => p.slug !== post.slug).slice(0, 3);


  if (!content || !blocks) {
    return (
      <div style={{ padding: '160px 24px', textAlign: 'center', background: T.navy, minHeight: '80vh' }}>
        <h2 style={{ fontFamily: font, color: T.white }}>
          {ar ? 'المقال غير موجود' : 'Post Not Found'}
        </h2>
        <a href="#/blog" style={{ color: T.gold, marginTop: 20, display: 'inline-block', fontFamily: font }}>
          {ar ? 'العودة للمدونة' : 'Back to Blog'}
        </a>
      </div>
    );
  }

  return (
    <div dir={ar ? 'rtl' : 'ltr'} style={{ background: '#F8FAFC', color: '#334155', fontFamily: font }}>
      <div style={{
        position: 'relative', width: '100%',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        
        overflow: 'hidden',
      }}>
        <svg
          width="156" height="63" viewBox="0 0 156 63" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', top: 0, left: 0, marginLeft: 96, marginTop: 32, pointerEvents: 'none', zIndex: 2 }}
        >
          <path
            d="M31 .5h32M0 .5h32m30 31h32m-1 0h32m-1 31h32M62.5 32V0m62 63V31"
            stroke="url(#detailBeamGrad)" strokeWidth={1.5}
          />
          <defs>
            <motion.linearGradient
              id="detailBeamGrad"
              variants={{
                initial: { x1: '40%', x2: '50%', y1: '160%', y2: '180%' },
                animate: { x1: '0%',  x2: '10%', y1: '-40%', y2: '-20%' },
              }}
              animate="animate" initial="initial"
              transition={{ duration: 1.8, repeat: Infinity, repeatType: 'loop', ease: 'linear', repeatDelay: 2 }}
            >
              <stop stopColor="#18CCFC" stopOpacity="0" />
              <stop stopColor="#18CCFC" />
              <stop offset="0.325" stopColor="#6344F5" />
              <stop offset="1" stopColor="#AE48FF" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>

        <div style={{
          position: 'relative', zIndex: 1,
          padding: 'clamp(120px,15vw,160px) clamp(24px,6vw,80px) clamp(56px,7vw,72px)',
          background: 'linear-gradient(to bottom, rgba(248, 250, 252, 0) 0%, #F8FAFC 100%)',
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
              <a href="#/blog" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: T.white, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = T.white; }}
              >
                {ar ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                {ar ? 'العودة للمدونة' : 'Back to Blog'}
              </a>

              <div style={{
                padding: '4px 12px', borderRadius: 4,
                background: `${post.accent}12`, border: `1px solid ${post.accent}33`,
              }}>
                <span style={{ fontFamily: font, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: post.accent }}>
                  {ar ? post.categoryAr : post.category}
                </span>
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: font, fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 900,
                lineHeight: 1.15, letterSpacing: '-0.03em', color: T.white, margin: '0 0 28px',
              }}
            >
              {ar ? post.titleAr : post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 24,
                borderTop: `1px solid ${T.border}`, paddingTop: 20,
                flexWrap: 'wrap', color: T.muted, fontSize: 13,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} style={{ color: post.accent }} />
                <span>{ar ? post.dateAr : post.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} style={{ color: post.accent }} />
                <span>{post.readTime} {ar ? 'دقائق قراءة' : 'min read'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} style={{ color: post.accent }} />
                <span>WAVZ Expert Team</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {blocks.map((block, i) => {
            if (block.type === 'heading') {
              const Tag = `h${Math.min(6, block.level || 2)}`;
              return (
                <Tag key={i} style={{
                  fontFamily: font,
                  color: '#082D4A',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  marginTop: 32,
                  marginBottom: 8,
                  lineHeight: 1.3,
                  fontSize: block.level === 2 ? 'clamp(20px,2.5vw,26px)' : 'clamp(16px,2vw,20px)',
                  borderLeft: ar ? 'none' : `3px solid ${post.accent}`,
                  borderRight: ar ? `3px solid ${post.accent}` : 'none',
                  paddingLeft: ar ? 0 : 12,
                  paddingRight: ar ? 12 : 0,
                }}>
                  {block.text}
                </Tag>
              );
            } else if (block.type === 'quote') {
              return (
                <blockquote key={i} style={{
                  fontFamily: font,
                  fontStyle: 'italic',
                  margin: '24px 0',
                  padding: '20px 24px',
                  background: 'rgba(17,115,189,0.04)',
                  borderLeft: ar ? 'none' : `4px solid #1173BD`,
                  borderRight: ar ? `4px solid #1173BD` : 'none',
                  borderRadius: 6,
                  color: '#334155',
                  lineHeight: 1.8,
                  fontSize: 16,
                }}>
                  {block.text}
                </blockquote>
              );
            } else if (block.type === 'list') {
              const ListTag = block.ordered ? 'ol' : 'ul';
              return (
                <ListTag key={i} style={{
                  fontFamily: font,
                  paddingLeft: ar ? 0 : 28,
                  paddingRight: ar ? 28 : 0,
                  margin: '12px 0 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  color: '#334155',
                  lineHeight: 1.75,
                  fontSize: 15.5,
                }}>
                  {block.items.map((item, j) => (
                    <li key={j} style={{
                      listStyleType: block.ordered ? 'decimal' : 'circle',
                    }}>
                      {item}
                    </li>
                  ))}
                </ListTag>
              );
            } else {
              return (
                <p key={i} style={{
                  fontFamily: font,
                  fontSize: 16.5,
                  lineHeight: 1.85,
                  color: '#334155',
                  margin: 0,
                  letterSpacing: '0.01em',
                }}>
                  {block.text}
                </p>
              );
            }
          })}
        </div>

        <div style={{ borderTop: '1px solid rgba(17,115,189,0.08)', marginTop: 64, paddingTop: 40, textAlign: ar ? 'right' : 'left' }}>
          <a href="#/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 6,
            background: '#ffffff', border: '1px solid rgba(17,115,189,0.15)',
            color: '#082D4A', textDecoration: 'none', fontSize: 14, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(8,45,74,0.04)',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1173BD'; e.currentTarget.style.color = '#1173BD'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(17,115,189,0.15)'; e.currentTarget.style.color = '#082D4A'; }}
          >
            {ar ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {ar ? 'العودة لجميع المقالات' : 'Back to All Articles'}
          </a>
        </div>
      </section>

      <section style={{ background: '#FAFBFD', borderTop: '1px solid rgba(17,115,189,0.08)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 20, height: 2, background: '#1173BD' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#082D4A', fontFamily: font }}>
              {ar ? 'مقالات ذات صلة' : 'Related Articles'}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {related.map((p, idx) => (
              <PostCard key={p.id} post={p} ar={ar} font={font} index={idx} />
            ))}
          </div>
        </div>

        {/* Blue accent line at the base */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent 0%, rgba(17,115,189,0.18) 30%, rgba(17,115,189,0.18) 70%, transparent 100%)',
          zIndex: 10, opacity: 0.55,
        }} />
      </section>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════ */
export const BlogPage = ({ route }) => {
  const { lang } = useLang();
  const ar   = lang === 'ar';
  const dir  = ar ? 'rtl' : 'ltr';
  const font = ar ? FONT_AR : FONT;

  const { data: dbPosts } = useBlog(null, POSTS);

  const postsList = (dbPosts && dbPosts.length > 0 ? dbPosts : POSTS).map(p => {
    if (p.published_at || p.created_at) {
      return mapDbPostToPost(p);
    }
    if (!p.slug) {
      const slug = p.url?.replace('https://wavz.com.eg/', '')?.split('/')[0] || '';
      return { ...p, slug };
    }
    return p;
  });

  const [search, setSearch]     = useState('');
  const [activeCat, setActiveCat] = useState(ar ? 'الكل' : 'All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const isBlogDetailRoute = route && route.startsWith('#/blog/');
  const activeSlug = isBlogDetailRoute ? route.replace('#/blog/', '') : null;
  const currentPost = isBlogDetailRoute ? postsList.find(p => p.slug === activeSlug) : null;

  if (isBlogDetailRoute && currentPost) {
    return <BlogDetailView post={currentPost} ar={ar} font={font} allPosts={postsList} />;
  }

  const cats     = ar ? ALL_CATS_AR : ALL_CATS_EN;
  const allLabel = ar ? 'الكل' : 'All';

  const filtered = postsList.filter(p => {
    const catMatch = activeCat === allLabel ||
      (ar ? p.categoryAr === activeCat : p.category === activeCat);
    const q = search.toLowerCase();
    const titleMatch = (ar ? p.titleAr : p.title).toLowerCase().includes(q) ||
                       (ar ? p.excerptAr : p.excerpt).toLowerCase().includes(q);
    return catMatch && (search === '' || titleMatch);
  });


  const featured = filtered[0];
  const rest     = filtered.slice(1);

  return (
    <div dir={dir} style={{ background: '#F8FAFC', color: '#082D4A', minHeight: '100vh', fontFamily: font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
        .blog-search:focus { border-color: #1173BD !important; outline: none; }
        .blog-cat:hover  { border-color: rgba(17,115,189,0.3) !important; color: #1173BD !important; }
        .blog-cat-active { background: rgba(255,184,20,0.12) !important; border-color: rgba(255,184,20,0.4) !important; color: #FFB814 !important; }
        .blog-cats-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 10px;
          width: 100%;
          justify-content: flex-start;
          box-sizing: border-box;
        }
        .blog-cats-container::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 1200px) {
          .blog-cats-container {
            justify-content: center;
          }
        }
        @media (max-width: 640px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .featured-img  { min-height: 200px !important; aspect-ratio: 16/9; }
        }
      `}</style>

      {/* ══ SOLID NAVY HERO ══ */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#061E31', borderBottom: `1px solid ${T.border}` }}>
        {/* Bottom fade gradient masking */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
          background: 'linear-gradient(to top, #F8FAFC 0%, rgba(248, 250, 252, 0) 100%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          padding: 'clamp(120px,15vw,180px) clamp(24px,6vw,80px) clamp(64px,8vw,96px)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 14px', borderRadius: 100,
                border: `1px solid rgba(255,184,20,0.3)`,
                background: 'rgba(255,184,20,0.08)', marginBottom: 28,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.gold, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'المدونة' : 'Blog'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white"
              style={{ fontFamily: font }}
            >
              WAVZ{' '}
              <span style={{ color: T.gold, fontStyle: 'italic' }}>
                {ar ? 'المدونة' : 'Blog'}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 'clamp(15px,1.7vw,19px)', lineHeight: 1.7, color: T.muted, maxWidth: 540, margin: '0 0 40px', fontFamily: font }}
            >
              {ar
                ? 'ابقَ على اطلاع بأحدث اتجاهات تكنولوجيا المعلومات والخدمات المُدارة والتحول الرقمي من فريق خبراء WAVZ.'
                : 'Stay informed with the latest IT, managed services, cybersecurity, and digital transformation insights from the WAVZ expert team.'}
            </motion.p>

          </div>
        </div>
      </div>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px,6vw,72px) clamp(24px,6vw,80px)' }}>
        {/* Toolbar containing Category Filters and SearchBar (Centered Column Layout) */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 24,
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 48,
          background: '#082D4A',
          border: '1px solid rgba(17,115,189,0.2)',
          boxShadow: '0 8px 24px rgba(8,45,74,0.12)',
          borderRadius: 16, padding: '24px 28px',
        }}>
          {/* Category filters */}
          <div className="blog-cats-container">
            {cats.map(cat => {
              const isActive = activeCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`blog-cat${isActive ? ' blog-cat-active' : ''}`}
                  style={{
                    fontFamily: font, fontSize: 12, fontWeight: isActive ? 700 : 500,
                    padding: '6px 14px',
                    border: `1px solid ${isActive ? 'rgba(255,184,20,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 100,
                    background: isActive ? 'rgba(255,184,20,0.12)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? T.gold : 'rgba(145,196,245,0.6)',
                    cursor: 'pointer', transition: 'all 0.18s ease',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* SearchBar */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <SearchBar
              placeholder={ar ? 'ابحث في المقالات...' : 'Search articles...'}
              searchQuery={search}
              setSearchQuery={setSearch}
              isAr={ar}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 0', color: '#64748b', fontFamily: font, fontSize: 15 }}
          >
            {ar ? 'لا توجد مقالات تطابق بحثك.' : 'No articles match your search.'}
          </motion.div>
        ) : (
          <>
            {featured && (
              <div style={{ marginBottom: 56 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 20, height: 2, background: '#1173BD' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#082D4A', fontFamily: font }}>
                    {ar ? 'المقال المميز' : 'Featured Article'}
                  </span>
                </div>
                <FeaturedCard post={featured} ar={ar} font={font} />
              </div>
            )}

            {rest.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                  <div style={{ width: 20, height: 2, background: '#1173BD' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#082D4A', fontFamily: font }}>
                    {ar ? 'جميع المقالات' : 'All Articles'}
                  </span>
                  <span style={{ fontFamily: font, fontSize: 11, color: '#64748b' }}>({rest.length})</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 20,
                }}>
                  {rest.map((post, i) => (
                    <PostCard key={post.id} post={post} ar={ar} font={font} index={i} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      <section style={{
        borderTop: `1px solid ${T.border}`,
        background: T.navy2,
        padding: 'clamp(48px,6vw,72px) clamp(24px,6vw,80px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 20, height: 1, background: T.gold }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontFamily: font }}>
                {ar ? 'النشرة الإخبارية' : 'Newsletter'}
              </span>
            </div>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 800, letterSpacing: '-0.025em', color: T.white, margin: '0 0 12px' }}>
              {ar ? 'ابقَ على اطلاع دائم بأخبار WAVZ' : 'Stay ahead with WAVZ insights'}
            </h2>
            <p style={{ fontFamily: font, fontSize: 14, lineHeight: 1.7, color: T.muted, margin: 0 }}>
              {ar
                ? 'احصل على آخر أخبار التكنولوجيا وتحديثات WAVZ مباشرةً في بريدك الإلكتروني بانتظام.'
                : 'Get regular updates about WAVZ and the latest industry news right in your inbox.'}
            </p>
          </div>
          <a
            href="#/contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', background: T.gold, color: T.navy,
              fontFamily: font, fontWeight: 700, fontSize: 14,
              textDecoration: 'none', borderRadius: 6,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.goldD; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.transform = 'none'; }}
          >
            {ar ? 'تواصل معنا' : 'Get in Touch'}
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};
