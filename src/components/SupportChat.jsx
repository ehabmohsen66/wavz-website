import { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { X, Send, ChevronDown, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './ErrorBoundary.jsx';

// Public Spline robot scene removed due to 403 errors

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: 'bot',
    text: "Hi! I'm the WAVZ AI Assistant. How can I help you with your enterprise transformation today?",
    time: 'now',
  },
];

const BOT_REPLIES = [
  "I'd be happy to help you explore how WAVZ can streamline your SAP or Temenos deployment. Want to schedule a consultation?",
  "Great question! WAVZ covers Multi-Industry, Multi-Service, and Multi-Geography delivery under one accountable lead.",
  "Our OperationsCenter runs 24/7 SOC + NOC — designed to keep your enterprise at 99.9% SLA. Shall I connect you with a specialist?",
  "WAVZ has delivered results for 15+ enterprise clients across MEA banking, government, and postal sectors. Would you like a case study?",
  "You can get started with a free consultation. Click 'Get a Consultation' in the nav — or I can arrange a call for you!",
];

export const SupportChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input.trim(), time: 'now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = BOT_REPLIES[replyIndex % BOT_REPLIES.length];
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text: reply, time: 'now' }]);
      setReplyIndex((i) => i + 1);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Robot Button - shifted up to avoid blocking privacy links */}
      <div className="fixed bottom-[88px] right-6 z-[9999] flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-[#082D4A] text-white text-[11.5px] font-semibold px-3.5 py-1.5 rounded-full shadow-lg border border-white/10 whitespace-nowrap"
            >
              Ask WAVZ AI ✨
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

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-[170px] right-6 z-[9998] w-[360px] max-h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-800"
            style={{ background: 'rgba(6, 15, 30, 0.97)', backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8 bg-gradient-to-r from-[#082D4A] to-[#0a3a5e]">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#1173BD]/50 bg-slate-950 flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center bg-[#082D4A]">
                  <Bot className="w-4 h-4 text-[#38BDF8]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-white">WAVZ AI Support</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10.5px] text-emerald-400 font-medium">Online · Typically replies instantly</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
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
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-[1.55] ${
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

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {['Book a call', 'Case studies', 'Pricing'].map((action) => (
                <button
                  key={action}
                  onClick={() => setInput(action)}
                  className="flex-shrink-0 text-[10.5px] px-3 py-1.5 rounded-full border border-[#1173BD]/40 text-[#38BDF8] hover:bg-[#1173BD]/20 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#1173BD]/60 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask anything about WAVZ…"
                  className="flex-1 bg-transparent text-white text-[12.5px] placeholder:text-white/30 outline-none"
                />
                <button
                  onClick={sendMessage}
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
    </>
  );
};

export default SupportChat;
