import { useState, useRef, useEffect } from 'react';
import { X, Send, ChevronDown, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/LangContext.jsx';
import { ErrorBoundary } from './ErrorBoundary.jsx';

export const SupportChat = () => {
  const { lang, dir } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Entirely hide/dismiss state
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('wavz_chat_dismissed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleDismiss = (e) => {
    e.stopPropagation();
    setDismissed(true);
    setOpen(false);
    try {
      localStorage.setItem('wavz_chat_dismissed', 'true');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = () => {
    setDismissed(false);
    try {
      localStorage.removeItem('wavz_chat_dismissed');
    } catch (err) {
      console.error(err);
    }
  };
  
  // Lead Capture State
  const [leadState, setLeadState] = useState('idle'); // 'idle' | 'collectName' | 'collectEmail' | 'collectCompany'
  const [leadData, setLeadData] = useState({ name: '', email: '', company: '' });

  // Localized Chat Texts
  const chatT = {
    en: {
      title: "WAVZ AI Assistant",
      status: "Online · Replies instantly",
      placeholder: "Ask anything about WAVZ...",
      initialMsg: "Hi! I'm the WAVZ AI Assistant. How can I help you with your enterprise transformation today?",
      quickActions: ['Book a technical call 📞', 'Explore SAP Services 💼', 'Payment & Fintech Solutions 💳'],
    },
    ar: {
      title: "مساعد WAVZ الذكي",
      status: "متصل الآن · يرد فوراً",
      placeholder: "اسأل أي شيء عن WAVZ...",
      initialMsg: "مرحباً! أنا المساعد الذكي لـ WAVZ. كيف يمكنني مساعدتك في مشروع التحول الرقمي لمؤسستك اليوم؟",
      quickActions: ['حجز استشارة فنية 📞', 'استكشف خدمات SAP 💼', 'حلول المدفوعات والـ Fintech 💳'],
    }
  };

  const activeT = chatT[lang] || chatT.en;

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialize/Reset chat on language change
  useEffect(() => {
    setMessages([
      {
        id: 1,
        from: 'bot',
        text: activeT.initialMsg,
        time: 'now',
      }
    ]);
    setLeadState('idle');
    setLeadData({ name: '', email: '', company: '' });
  }, [lang]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Smart Q&A Knowledge Base
  const getBotResponse = (lowerText) => {
    // Lead Flow triggers
    if (
      lowerText.includes('call') || 
      lowerText.includes('book') || 
      lowerText.includes('contact') || 
      lowerText.includes('specialist') || 
      lowerText.includes('sales') || 
      lowerText.includes('consult') || 
      lowerText.includes('pricing') ||
      lowerText.includes('price') ||
      lowerText.includes('سعر') ||
      lowerText.includes('تواصل') ||
      lowerText.includes('حجز') ||
      lowerText.includes('استشارة')
    ) {
      setLeadState('collectName');
      return lang === 'ar'
        ? "يسعدني جداً ترتيب استشارة فنية مخصصة لك مع كبار مهندسينا! للبدء، ما هو اسمك الكامل؟"
        : "I would be delighted to arrange a technical consultation with our senior architects! To get started, what is your full name?";
    }

    // Keyword logic
    if (lowerText.includes('sap') || lowerText.includes('erp') || lowerText.includes('ساب')) {
      return lang === 'ar'
        ? "WAVZ هي شريك SAP Gold معتمد. نحن نقدم خدمات استشارية شاملة لـ SAP ERP، وتطبيق الوحدات المخصصة، وترقيات النظام والهجرة السحابية، مع دعم فني متكامل على مدار الساعة طوال أيام الأسبوع."
        : "WAVZ is a certified SAP Gold Partner. We provide comprehensive SAP ERP consulting, custom module implementation, system migrations, health checks, and ongoing 24/7 application support under an accountable managed services model.";
    }
    
    if (
      lowerText.includes('temenos') || 
      lowerText.includes('t24') || 
      lowerText.includes('core banking') || 
      lowerText.includes('banking') ||
      lowerText.includes('بانك') ||
      lowerText.includes('بنك') ||
      lowerText.includes('تيمينوس')
    ) {
      return lang === 'ar'
        ? "نحن شريك تكامل مصارف أساسية موثوق، متخصصون في Temenos Transact وTemenos Infinity وأنظمة T24. ندعم البنوك الإقليمية في عمليات الترحيل الشامل، وربط واجهات البرمجة المخصصة، وإدارة قواعد البيانات، وزيادة الموارد التقنية المصرفية."
        : "WAVZ is a trusted core banking integration partner, specialized in Temenos Transact, Temenos Infinity, and T24 systems. We support MEA banks with end-to-end migrations, custom banking APIs, database administration, and testing.";
    }

    if (
      lowerText.includes('payment') || 
      lowerText.includes('tietoevry') || 
      lowerText.includes('fintech') || 
      lowerText.includes('open banking') ||
      lowerText.includes('دفع') ||
      lowerText.includes('مدفوعات') ||
      lowerText.includes('تيتوإيفري')
    ) {
      return lang === 'ar'
        ? "نحن نتعاون مع شركة Tietoevry العالمية لتشغيل بنية المدفوعات من الجيل التالي، بما في ذلك إصدار البطاقات، وقبول التجار، والتحويل الفوري للمدفوعات، والخدمات المصرفية المفتوحة (Open Banking)."
        : "We partner with Tietoevry to power next-generation payment systems, including card issuing, merchant acquiring, switching, processing, and instant payments. We also offer advanced API Banking platforms and Open Banking solutions.";
    }

    if (
      lowerText.includes('cyber') || 
      lowerText.includes('security') || 
      lowerText.includes('soc') || 
      lowerText.includes('noc') || 
      lowerText.includes('nevis') ||
      lowerText.includes('أمن') ||
      lowerText.includes('سيبراني') ||
      lowerText.includes('حماية')
    ) {
      return lang === 'ar'
        ? "يدير مركز العمليات لدينا خدمات SOC وNOC على مدار الساعة طوال أيام الأسبوع لضمان جاهزية 99.9%. نحن نتعاون مع Nevis Security AG لتقديم حلول متطورة لإدارة الهوية والأمان المصرفي الفائق."
        : "Our Operations Center runs 24/7. We offer a dedicated Security Operations Center (SOC) partnered with Nevis Security AG for banking-grade Identity Access Management (IAM) and secure login, alongside a Network Operations Center (NOC) ensuring a 99.9% uptime SLA.";
    }

    if (
      lowerText.includes('ceo') || 
      lowerText.includes('founder') || 
      lowerText.includes('amr') || 
      lowerText.includes('esmat') || 
      lowerText.includes('عمرو') || 
      lowerText.includes('عصمت')
    ) {
      return lang === 'ar'
        ? "يقود شركة WAVZ الرئيس التنفيذي والعضو المنتدب المهندس عمرو عصمت. تأسست الشركة في عام 2015 كذراع للتحول الرقمي لشركة البريد للاستثمار (PFI)."
        : "WAVZ is led by our Managing Director & CEO Eng. Amr Esmat. The company was founded in 2015 as the digital transformation arm of Post for Investment (PFI).";
    }

    if (
      lowerText.includes('about') || 
      lowerText.includes('who') || 
      lowerText.includes('founded') || 
      lowerText.includes('staff') || 
      lowerText.includes('employee') ||
      lowerText.includes('من نحن') ||
      lowerText.includes('تأسيس') ||
      lowerText.includes('موظف')
    ) {
      return lang === 'ar'
        ? "تأسست WAVZ للتحول الرقمي في عام 2015 كذراع تقني. ونحن نضم اليوم أكثر من 1,300 متخصص يقدمون حلولاً وخدمات متطورة في مصر ودول الخليج وشرق أفريقيا."
        : "WAVZ for Digital Transformation was founded in 2015. Today, we are home to over 1,300 tech specialists delivering cutting-edge enterprise solutions across Egypt, the GCC, and East Africa.";
    }

    if (
      lowerText.includes('project') || 
      lowerText.includes('sczone') || 
      lowerText.includes('west port') || 
      lowerText.includes('baheya') ||
      lowerText.includes('مشروع') ||
      lowerText.includes('بورسعيد') ||
      lowerText.includes('بهية')
    ) {
      return lang === 'ar'
        ? "تشمل مشاريعنا البارزة تطبيق التحول الرقمي للمنطقة الاقتصادية لقناة السويس (SC-Zone)، وإدارة مركز بيانات منطقة غرب بورسعيد الحرة، وبروتوكول دعم SAP لمؤسسة بهية لعلاج سرطان الثدي مجاناً."
        : "Key WAVZ milestones include executing the Suez Canal Economic Zone (SC-Zone) digital transformation masterplan, managing the digital infrastructure of West Port Said Free Zone, and SAP support protocols for Baheya Foundation.";
    }

    if (
      lowerText.includes('service') || 
      lowerText.includes('offer') || 
      lowerText.includes('managed') ||
      lowerText.includes('خدمات') ||
      lowerText.includes('عرض')
    ) {
      return lang === 'ar'
        ? "نحن نقدم خدمات متميزة تشمل: العمليات المدارة (SOC/NOC)، وحلول التكنولوجيا المصرفية (Temenos)، وأنظمة مدفوعات Tietoevry، واستشارات SAP، وحلول التحول الرقمي الشاملة."
        : "We offer high-value services across: Managed IT Operations (24/7 SOC/NOC), Core Banking Integrations (Temenos), Payment Systems (Tietoevry), SAP Consulting, and Digital Strategy Transformations.";
    }

    // Default Fallback
    return lang === 'ar'
      ? "هذا استفسار رائع! تتخصص WAVZ في التحول الرقمي المعقد، والأنظمة المصرفية (Temenos)، وحلول SAP، وخدمات الدعم المدارة 24/7. هل ترغب في التحدث مع مستشار فني لمناقشة متطلباتك؟"
      : "That's an interesting inquiry! WAVZ specializes in complex digital transformations, core banking (Temenos), SAP ERP consulting, and 24/7 Managed Services (SOC/NOC). Would you like to connect with a senior technical consultant to discuss your specific needs?";
  };

  const sendMessage = (textToSend = '') => {
    const rawText = textToSend || input;
    if (!rawText.trim()) return;

    // Push User message
    const userMsg = { id: Date.now(), from: 'user', text: rawText.trim(), time: 'now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = '';
      const lowerText = rawText.toLowerCase().trim();

      // Conversational State Machine for Lead Capturing
      if (leadState === 'collectName') {
        const nameVal = rawText.trim();
        setLeadData((prev) => ({ ...prev, name: nameVal }));
        setLeadState('collectEmail');
        botReply = lang === 'ar'
          ? `سعدت بلقائك يا ${nameVal}! ما هو عنوان بريدك الإلكتروني الذي يمكننا التواصل معك من خلاله؟`
          : `Nice to meet you, ${nameVal}! What is the best email address to reach you at?`;
      } 
      else if (leadState === 'collectEmail') {
        const emailVal = rawText.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(emailVal)) {
          botReply = lang === 'ar'
            ? "يبدو أن البريد الإلكتروني غير صحيح. يرجى إدخال بريد إلكتروني صالح (مثال: name@company.com):"
            : "That email address doesn't seem valid. Please provide a valid email address (e.g., name@company.com):";
        } else {
          setLeadData((prev) => ({ ...prev, email: emailVal }));
          setLeadState('collectCompany');
          botReply = lang === 'ar'
            ? "رائع! ما هو اسم شركتك، وما هي تفاصيل مشروعك أو التحدي المصرفي/الرقمي الذي يواجهك حالياً؟"
            : "Got it! What company are you representing, and is there a specific digital or banking challenge you'd like us to discuss?";
        }
      } 
      else if (leadState === 'collectCompany') {
        const companyVal = rawText.trim();
        const finalLead = {
          ...leadData,
          company: companyVal,
          date: new Date().toISOString()
        };
        
        // Save Captured Lead to localStorage
        try {
          const existingLeads = JSON.parse(localStorage.getItem('wavz_leads') || '[]');
          existingLeads.push(finalLead);
          localStorage.setItem('wavz_leads', JSON.stringify(existingLeads));
        } catch (e) {
          console.error("Failed to save lead:", e);
        }

        setLeadState('idle');
        setLeadData({ name: '', email: '', company: '' });
        botReply = lang === 'ar'
          ? `ممتاز يا ${finalLead.name}! لقد قمت بتسجيل استفسارك بنجاح. سيتواصل معك أحد مهندسي التحول الرقمي لدينا عبر البريد الإلكتروني (${finalLead.email}) في غضون 24 ساعة. شكراً لك!`
          : `Excellent, ${finalLead.name}! I have successfully recorded your details. A WAVZ digital transformation architect will reach out to you at ${finalLead.email} within 24 hours to schedule a session. Thank you!`;
      } 
      else {
        // Normal smart search logic
        botReply = getBotResponse(lowerText);
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text: botReply, time: 'now' }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ErrorBoundary>
      {/* Floating Robot Button */}
      {!dismissed && (
        <div 
          className={`fixed bottom-[88px] z-[9999] flex flex-col gap-3 ${
            dir === 'rtl' ? 'left-6 items-start' : 'right-6 items-end'
          }`} 
          dir={dir}
        >
          {/* Close/Hide Button */}
          <AnimatePresence>
            {!open && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleDismiss}
                title={lang === 'ar' ? 'إخفاء المساعد بالكامل' : 'Hide AI assistant entirely'}
                className={`absolute -top-2 z-[10000] w-6 h-6 rounded-full bg-slate-900/90 border border-white/15 hover:bg-red-500 hover:border-red-500 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                  dir === 'rtl' ? '-right-2' : '-left-2'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-[#082D4A] text-white text-[11.5px] font-semibold px-3.5 py-1.5 rounded-full shadow-lg border border-white/10 whitespace-nowrap"
              >
                {lang === 'ar' ? 'اسأل مساعد WAVZ الذكي ✨' : 'Ask WAVZ AI ✨'}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-[72px] h-[72px] rounded-full overflow-hidden shadow-2xl shadow-[#1173BD]/40 border-2 border-[#1173BD]/60 bg-slate-950 cursor-pointer"
            style={{ outline: 'none' }}
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full border-2 border-[#38BDF8]/40 animate-ping" />

            {/* Static Robot Icon */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#082D4A] to-slate-950 relative group">
              <div className="absolute inset-0 bg-[#38BDF8]/10 animate-pulse rounded-full" />
              <Bot className="w-8 h-8 text-[#38BDF8] relative z-10 transition-transform group-hover:scale-110 duration-300" />
            </div>

            {/* Open/Close overlay icon */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-full"
                >
                  <ChevronDown className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`fixed bottom-[170px] z-[9998] w-[360px] max-h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-800 ${
              dir === 'rtl' ? 'left-6' : 'right-6'
            }`}
            style={{ background: 'rgba(6, 15, 30, 0.97)', backdropFilter: 'blur(20px)', direction: dir }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8 bg-gradient-to-r from-[#082D4A] to-[#0a3a5e]">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#1173BD]/50 bg-slate-950 flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center bg-[#082D4A]">
                  <Bot className="w-4 h-4 text-[#38BDF8]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-white">{activeT.title}</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10.5px] text-emerald-400 font-medium">{activeT.status}</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Registration Banner */}
            {leadState !== 'idle' && (
              <div className="bg-[#FFB814]/15 border-b border-[#FFB814]/25 px-4 py-2 text-[11px] text-[#FFB814] flex items-center justify-between font-semibold">
                <span>{lang === 'ar' ? 'وضع حجز استشارة فنية 📞' : 'Consultation Booking Mode 📞'}</span>
                <button 
                  onClick={() => {
                    setLeadState('idle');
                    setLeadData({ name: '', email: '', company: '' });
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now(),
                        from: 'bot',
                        text: lang === 'ar' ? 'تم إلغاء نموذج التسجيل. كيف يمكنني مساعدتك الآن؟' : 'Registration flow cancelled. How else can I assist you?',
                        time: 'now'
                      }
                    ]);
                  }}
                  className="text-[10.5px] font-bold underline hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/5"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" style={{ maxHeight: '340px' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[#1173BD]/20 border border-[#1173BD]/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-[#38BDF8]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-[1.55] whitespace-pre-line ${
                      msg.from === 'user'
                        ? 'bg-[#FFB814] text-[#082D4A] font-semibold rounded-br-md'
                        : 'bg-white/8 text-white/85 border border-white/8 rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1173BD]/20 border border-[#1173BD]/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-[#38BDF8]" />
                    </div>
                    <div className="bg-white/8 border border-white/8 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (only shown if not in lead capture flow) */}
            {leadState === 'idle' && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto select-none scrollbar-thin">
                {activeT.quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => sendMessage(action)}
                    className="flex-shrink-0 text-[10.5px] px-3 py-1.5 rounded-full border border-[#1173BD]/40 text-[#38BDF8] hover:bg-[#1173BD]/20 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#1173BD]/60 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={activeT.placeholder}
                  className="flex-1 bg-transparent text-white text-[12.5px] placeholder:text-white/30 outline-none"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg bg-[#FFB814] flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:bg-[#F5A800] transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5 text-[#082D4A]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small Restore Button when fully dismissed */}
      <AnimatePresence>
        {dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`fixed bottom-6 z-[9999] ${
              dir === 'rtl' ? 'left-6' : 'right-6'
            }`}
            dir={dir}
          >
            <button
              onClick={handleRestore}
              title={lang === 'ar' ? 'إظهار مساعد الذكاء الاصطناعي' : 'Show AI Assistant'}
              className="group relative w-10 h-10 rounded-full bg-[#082D4A]/80 backdrop-blur-md border border-[#1173BD]/40 text-[#38BDF8] hover:text-white hover:bg-[#1173BD] hover:border-[#1173BD] flex items-center justify-center transition-all duration-250 shadow-lg cursor-pointer"
            >
              <Bot className="w-5 h-5 transition-transform group-hover:scale-110" />
              
              {/* Tooltip on hover */}
              <span className={`absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-slate-950 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded shadow-md border border-white/10 ${
                dir === 'rtl' ? 'left-0' : 'right-0'
              }`}>
                {lang === 'ar' ? 'إظهار مساعد WAVZ ✨' : 'Show WAVZ AI ✨'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default SupportChat;
