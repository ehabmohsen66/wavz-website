import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';

const ORB_X = 40;
const ORB_Y = 20;

export const NotFound = () => {
  const { lang, dir } = useLang();
  const isAr = lang === 'ar';

  return (
    <div
      className="w-full relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at center, rgba(17,115,189,0.10) 0%, transparent 70%)',
      }}
      dir={dir}
    >
      {/* ── Animated orbs ── */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Primary orb */}
        <motion.div
          animate={{
            x: [0, ORB_X, -ORB_X, 0],
            y: [0, ORB_Y, -ORB_Y, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '33%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(17,115,189,0.22) 0%, rgba(255,184,20,0.10) 100%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Secondary orb */}
        <motion.div
          animate={{
            x: [0, -ORB_X, ORB_X, 0],
            y: [0, -ORB_Y, ORB_Y, 0],
          }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '30%',
            right: '22%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(8,45,74,0.18) 0%, rgba(17,115,189,0.10) 100%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center text-center px-6 gap-6"
      >
        {/* 404 number */}
        <motion.h1
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontSize: 'clamp(80px, 18vw, 160px)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #082D4A 0%, #1173BD 55%, #FFB814 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 700,
            color: '#082D4A',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            fontSize: 15,
            color: '#64748b',
            lineHeight: 1.7,
            maxWidth: 400,
            margin: 0,
          }}
        >
          {isAr
            ? 'الصفحة التي تبحث عنها ربما تم نقلها أو حذفها أو لم تكن موجودة أصلاً.'
            : "The page you're looking for might have been moved or doesn't exist."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex gap-3 flex-wrap justify-center"
        >
          {/* Primary — Go Home */}
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[14px] cursor-pointer transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #082D4A 0%, #1173BD 100%)',
              color: '#fff',
              boxShadow: '0 4px 18px rgba(17,115,189,0.30)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(17,115,189,0.45)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(17,115,189,0.30)')}
          >
            <Home className="w-4 h-4" />
            {isAr ? 'العودة للرئيسية' : 'Go Home'}
          </a>

          {/* Secondary — Contact */}
          <a
            href="#/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[14px] cursor-pointer transition-all duration-200"
            style={{
              background: '#fff',
              color: '#082D4A',
              border: '1.5px solid rgba(17,115,189,0.25)',
              boxShadow: '0 2px 8px rgba(8,45,74,0.06)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1173BD';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(17,115,189,0.14)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(17,115,189,0.25)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(8,45,74,0.06)';
            }}
          >
            <Compass className="w-4 h-4" />
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};
