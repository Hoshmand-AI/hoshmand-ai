"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LogoMark from "../LogoMark";
import { reply, suggestionsFor, type GuideAction } from "@/lib/guide";
import type { Project } from "@/lib/projects";

interface Message {
  id: number;
  from: "user" | "guide";
  text: string;
  actions?: GuideAction[];
  note?: string;
}

/** Open the guide from anywhere: window.dispatchEvent(new CustomEvent("hoshmand:ask", { detail: "question" })) */
export const ASK_EVENT = "hoshmand:ask";

const spring = { type: "spring" as const, bounce: 0.12, duration: 0.5 };

/** `products` is the live list (lib/live.ts), so even the offline answers use current names. */
export default function Guide({ products }: { products?: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typing, setTyping] = useState<number | null>(null);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Latest transcript, so a question can be sent with the conversation so far.
  const history = useRef<Message[]>([]);
  history.current = messages;
  // Once the AI route reports it is unavailable, stop calling it for this visit.
  const aiOff = useRef(false);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q) return;
      setInput("");
      const turns = [...history.current.map((m) => ({ role: m.from === "user" ? "user" : "assistant", text: m.text })), { role: "user", text: q }];
      setMessages((m) => [...m, { id: nextId.current++, from: "user", text: q }]);
      setThinking(true);

      // Ask the AI guide first; fall back to the built-in answers when it is unavailable.
      let r: { text: string; actions: GuideAction[] } | null = null;
      if (!aiOff.current) {
        try {
          const res = await fetch("/api/guide", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: turns }),
          });
          const data = await res.json();
          if (data?.ok && typeof data.text === "string") r = { text: data.text, actions: data.actions ?? [] };
          else if (data?.reason === "unconfigured") aiOff.current = true;
        } catch {
          // Network or parse failure: answer locally.
        }
      }
      if (!r) {
        // A short beat so the answer reads as considered.
        if (!reduce) await new Promise((done) => window.setTimeout(done, 420));
        r = reply(q, products);
      }
      const id = nextId.current++;
      setThinking(false);
      setMessages((m) => [...m, { id, from: "guide", text: r.text, actions: r.actions }]);
      setTyping(id);
    },
    [reduce, products]
  );

  // ⌘K / Ctrl+K toggles, Esc closes, and any element can open the guide with a question.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onAsk(e: Event) {
      setOpen(true);
      const detail = (e as CustomEvent<string | undefined>).detail;
      if (detail) ask(detail);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(ASK_EVENT, onAsk);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(ASK_EVENT, onAsk);
    };
  }, [ask]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      inputRef.current?.focus({ preventScroll: true });
    } else if (wasOpen.current) {
      // The launcher re-mounts as the panel leaves; hand keyboard focus back to it.
      const t = window.setTimeout(() => launcherRef.current?.focus({ preventScroll: true }), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, thinking, typing, reduce]);

  function addNote(id: number, note: string) {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, note } : x)));
  }

  async function run(action: GuideAction, messageId: number) {
    if (action.kind === "navigate") {
      addNote(messageId, `Taking you to ${action.label.replace(/^(See|Open|Read) /, "").replace(/^the /, "")}…`);
      router.push(action.href);
      if (window.matchMedia("(max-width: 640px)").matches) setOpen(false);
    } else if (action.kind === "external") {
      window.open(action.href, action.href.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer");
    } else if (action.kind === "copy") {
      try {
        await navigator.clipboard.writeText(action.text);
        addNote(messageId, `Copied ${action.text}`);
      } catch {
        addNote(messageId, action.text);
      }
    }
  }

  const suggestions = suggestionsFor(pathname, products);

  // While the home page's own Ask bar is on screen, the floating launcher would only duplicate it
  // (and on a phone it covers the hero buttons), so it waits until that bar scrolls away.
  const [askBarVisible, setAskBarVisible] = useState(false);
  useEffect(() => {
    const bar = document.getElementById("hero-ask")?.closest("form");
    if (!bar) {
      setAskBarVisible(false);
      return;
    }
    const io = new IntersectionObserver(([e]) => setAskBarVisible(e.isIntersecting), { threshold: 0 });
    io.observe(bar);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && !askBarVisible && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={spring}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full border border-white/10 bg-navy-950/90 py-2 pl-2 pr-4 text-[13.5px] font-semibold text-white shadow-[0_16px_40px_-12px_rgba(10,22,40,0.6)] backdrop-blur-xl transition-colors hover:bg-navy-900"
            aria-label="Ask the Hoshmand AI guide"
            aria-keyshortcuts="Meta+K Control+K"
          >
            <LogoMark size={30} />
            Ask
            <kbd className="hidden rounded-md border border-white/15 px-1.5 py-0.5 font-sans text-[10.5px] font-medium text-white/55 sm:inline">⌘K</kbd>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Hoshmand AI guide"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={spring}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-3 z-[70] flex max-h-[min(640px,calc(100dvh-5.5rem))] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-navy-950/95 text-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
              <LogoMark size={34} active={thinking || typing !== null} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold leading-tight">Hoshmand guide</p>
                <p className="truncate text-[11.5px] text-white/50">Answers come from what is on this site.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white active:scale-90"
                aria-label="Close guide"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
              {messages.length === 0 && (
                <div>
                  <p className="font-serif text-[22px] leading-tight">What are you trying to get done?</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                    Ask about a product, how to get an invite, or how to reach us. I can also take you there.
                  </p>
                </div>
              )}
              {messages.map((m) =>
                m.from === "user" ? (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-gold-500 px-3.5 py-2 text-[13.5px] font-medium text-navy-950">
                    {m.text}
                  </motion.div>
                ) : (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="max-w-[92%]">
                    <div className="rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.05] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white/90">
                      <Typed text={m.text} animate={typing === m.id && !reduce} onDone={() => setTyping((t) => (t === m.id ? null : t))} />
                    </div>
                    {typing !== m.id && m.actions && m.actions.length > 0 && (
                      <motion.div
                        className="mt-2 flex flex-wrap gap-1.5"
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                      >
                        {m.actions.map((a) =>
                          a.kind === "waitlist" ? (
                            <WaitlistChip key={a.label + a.slug} action={a} />
                          ) : (
                            <motion.button
                              key={a.label}
                              type="button"
                              variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                              onClick={() => run(a, m.id)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium text-white/90 transition-colors hover:border-gold-500/60 hover:bg-gold-500/10 active:scale-95"
                            >
                              {a.label}
                              <ActionIcon kind={a.kind} />
                            </motion.button>
                          )
                        )}
                      </motion.div>
                    )}
                    {m.note && <p className="mt-2 text-[12px] text-gold-400" role="status">{m.note}</p>}
                  </motion.div>
                )
              )}
              {thinking && (
                <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.05] px-3.5 py-3" aria-label="Thinking">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-white/60" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.08] px-3 pb-3 pt-2.5">
              <div className="-mx-1 mb-2 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="shrink-0 whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/25 hover:text-white active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); ask(input); }}
                className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] p-1 pl-4 focus-within:border-gold-500/70"
              >
                <label htmlFor="guide-input" className="sr-only">Ask the guide</label>
                <input
                  ref={inputRef}
                  id="guide-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about Hoshmand AI"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-white/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-950 transition-[transform,opacity] active:scale-90 disabled:opacity-40"
                  aria-label="Send"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Types the answer out a few characters at a time; the full text is always in the DOM for screen readers.
function Typed({ text, animate, onDone }: { text: string; animate: boolean; onDone: () => void }) {
  const [shown, setShown] = useState(animate ? 0 : text.length);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!animate) {
      done.current();
      return;
    }
    const timer = window.setInterval(() => {
      setShown((n) => {
        const next = Math.min(text.length, n + 3);
        if (next === text.length) {
          window.clearInterval(timer);
          done.current();
        }
        return next;
      });
    }, 16);
    return () => window.clearInterval(timer);
  }, [animate, text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
    </>
  );
}

function ActionIcon({ kind }: { kind: GuideAction["kind"] }) {
  const d =
    kind === "external"
      ? "M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
      : kind === "copy"
        ? "M8 7V5a2 2 0 012-2h9a2 2 0 012 2v9a2 2 0 01-2 2h-2M5 8h9a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2z"
        : "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3";
  return (
    <svg className="h-3 w-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

// A chip that turns into an email field and signs the visitor up without leaving the chat.
function WaitlistChip({ action }: { action: Extract<GuideAction, { kind: "waitlist" }> }) {
  const [state, setState] = useState<"idle" | "open" | "loading" | "done" | "error">("idle");
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, project: action.slug }),
      });
      const data = await res.json();
      setState(data.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <motion.span layout className="inline-flex items-center gap-1.5 rounded-full bg-success-500/20 px-3 py-1.5 text-[12.5px] font-medium text-[#8FD4B8]" role="status">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        You&apos;re on the {action.name} list
      </motion.span>
    );
  }

  if (state === "idle") {
    return (
      <motion.button
        layout
        type="button"
        variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
        onClick={() => setState("open")}
        className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1.5 text-[12.5px] font-semibold text-navy-950 transition-colors hover:bg-gold-400 active:scale-95"
      >
        {action.label}
      </motion.button>
    );
  }

  return (
    <motion.form layout onSubmit={submit} className="flex w-full items-center gap-1 rounded-full border border-gold-500/60 bg-white/[0.06] p-1 pl-3.5">
      <label htmlFor={`guide-wl-${action.slug}`} className="sr-only">Email for the {action.name} waitlist</label>
      <input
        id={`guide-wl-${action.slug}`}
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={`Email for ${action.name}`}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-white/60 focus:outline-none"
      />
      <button type="submit" disabled={state === "loading"} className="shrink-0 rounded-full bg-gold-500 px-3 py-1.5 text-[12px] font-semibold text-navy-950 active:scale-95 disabled:opacity-50">
        {state === "loading" ? "Joining…" : state === "error" ? "Try again" : "Join"}
      </button>
    </motion.form>
  );
}
