import { useState, useEffect, useRef } from 'react';

/**
 * Terminal — animated CLI component
 *
 * Props:
 *   commands            string[]            list of commands to type out
 *   outputs             Record<number, string[]>  optional output lines per command index
 *   typingSpeed         number (ms)         ms per character (default 45)
 *   delayBetweenCommands number (ms)        pause after output before next command (default 1000)
 *   title               string              window title (default "bash")
 *   loop                boolean             restart after last command (default true)
 */
export function Terminal({
  commands = [],
  outputs = {},
  typingSpeed = 45,
  delayBetweenCommands = 1000,
  title = 'bash',
  loop = true,
}) {
  const [lines, setLines]           = useState([]);   // rendered lines in terminal body
  const [cmdIdx, setCmdIdx]         = useState(0);    // which command we're on
  const [charIdx, setCharIdx]       = useState(0);    // how many chars typed so far
  const [phase, setPhase]           = useState('typing'); // typing | output | waiting
  const bodyRef                     = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (commands.length === 0) return;

    const cmd = commands[cmdIdx];

    // ── Phase: typing ──────────────────────────────────────────
    if (phase === 'typing') {
      if (charIdx < cmd.length) {
        const t = setTimeout(() => {
          setLines(prev => {
            const next = [...prev];
            // last line is always the live prompt line
            if (next.length === 0 || next[next.length - 1].type !== 'prompt') {
              next.push({ type: 'prompt', text: '' });
            }
            next[next.length - 1] = { type: 'prompt', text: cmd.slice(0, charIdx + 1) };
            return next;
          });
          setCharIdx(c => c + 1);
        }, typingSpeed);
        return () => clearTimeout(t);
      } else {
        // Done typing → show output (if any) then wait
        const cmdOutputs = outputs[cmdIdx] || [];
        if (cmdOutputs.length > 0) {
          setLines(prev => {
            const next = [...prev];
            // Freeze the prompt line (no cursor)
            if (next.length > 0) next[next.length - 1] = { type: 'done', text: cmd };
            cmdOutputs.forEach(line => next.push({ type: 'output', text: line }));
            return next;
          });
        } else {
          setLines(prev => {
            const next = [...prev];
            if (next.length > 0) next[next.length - 1] = { type: 'done', text: cmd };
            return next;
          });
        }
        setPhase('waiting');
      }
    }

    // ── Phase: waiting between commands ────────────────────────
    if (phase === 'waiting') {
      const t = setTimeout(() => {
        const nextIdx = cmdIdx + 1;
        if (nextIdx < commands.length) {
          setCmdIdx(nextIdx);
          setCharIdx(0);
          setPhase('typing');
        } else if (loop) {
          // restart
          setLines([]);
          setCmdIdx(0);
          setCharIdx(0);
          setPhase('typing');
        }
      }, delayBetweenCommands);
      return () => clearTimeout(t);
    }
  }, [phase, cmdIdx, charIdx, commands, outputs, typingSpeed, delayBetweenCommands, loop]);

  const currentTypingText =
    phase === 'typing'
      ? commands[cmdIdx]?.slice(0, charIdx) ?? ''
      : null;

  return (
    <div
      style={{
        background: '#0D1117',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace",
        fontSize: 13.5,
        lineHeight: 1.7,
      }}
    >
      {/* ── Title bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          background: '#161B22',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Traffic-light dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F56', '#FFBD2E', '#27C93F'].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
        </div>
        {/* Window title */}
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </span>
        <div style={{ width: 54 }} /> {/* spacer to balance title */}
      </div>

      {/* ── Body ── */}
      <div
        ref={bodyRef}
        style={{
          padding: '20px 24px 24px',
          minHeight: 200,
          maxHeight: 340,
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {/* Completed / output lines */}
        {lines.map((line, i) => {
          if (line.type === 'prompt' || line.type === 'done') {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 2 }}>
                <span style={{ color: '#FFB814', userSelect: 'none', flexShrink: 0 }}>❯</span>
                <span style={{ color: '#E6EDF3' }}>{line.text}</span>
                {/* Blinking cursor only on the live prompt line */}
                {line.type === 'prompt' && (
                  <Cursor />
                )}
              </div>
            );
          }
          if (line.type === 'output') {
            return (
              <div key={i} style={{ color: '#8B949E', paddingLeft: 20, marginBottom: 2 }}>
                {line.text}
              </div>
            );
          }
          return null;
        })}

        {/* Live typing line (when phase is typing and lines haven't caught up) */}
        {phase === 'typing' && lines.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: '#FFB814', userSelect: 'none', flexShrink: 0 }}>❯</span>
            <span style={{ color: '#E6EDF3' }}>{currentTypingText}</span>
            <Cursor />
          </div>
        )}

        {/* Idle cursor after all commands done */}
        {phase === 'waiting' && cmdIdx === commands.length - 1 && !loop && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ color: '#FFB814', userSelect: 'none', flexShrink: 0 }}>❯</span>
            <Cursor />
          </div>
        )}
      </div>

      <style>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 15px;
          background: #FFB814;
          border-radius: 1px;
          margin-left: 1px;
          vertical-align: middle;
          animation: terminal-blink 1.1s ease infinite;
        }
        /* Hide scrollbar in webkit */
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function Cursor() {
  return <span className="terminal-cursor" />;
}
