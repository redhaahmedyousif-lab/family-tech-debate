"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, CheckCheck } from "lucide-react";

const STORAGE_KEY = "family-tech-debate:notice-read";

/** Blocking notice shown on first load of each browser session. */
export default function NoticeModal() {
  // Open by default so the statically exported HTML is blocked until hydration decides.
  const [open, setOpen] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setOpen(false);
    } catch {
      // sessionStorage unavailable: keep showing the notice.
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    buttonRef.current?.focus();
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open]);

  const acknowledge = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore: the notice simply reappears next load.
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink-950/60 p-4 backdrop-blur-md"
          onKeyDown={(e) => {
            // Keep keyboard focus inside the dialog; Escape does not dismiss it.
            if (e.key === "Tab") {
              e.preventDefault();
              buttonRef.current?.focus();
            }
          }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="notice-title"
            aria-describedby="notice-message"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-md rounded-[2rem] bg-gradient-to-l from-gold-400 to-cyan-400 p-[2px] shadow-2xl shadow-black/60"
          >
            <div className="relative overflow-hidden rounded-[calc(2rem-2px)] bg-ink-950 px-6 py-9 text-center sm:px-10">
              <div aria-hidden className="absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-gold-500/25 blur-3xl" />
              <motion.span
                aria-hidden
                className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 text-ink-950 shadow-lg shadow-gold-500/30"
                animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
                transition={{ duration: 1.2, delay: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <BellRing className="size-8" />
              </motion.span>
              <h2 id="notice-title" className="relative mt-5 text-2xl font-black sm:text-3xl">
                <span className="text-gradient-heritage">تنبيه هام</span>
              </h2>
              <p id="notice-message" className="relative mt-4 text-lg leading-loose text-stone-200">
                لم ننتهِ بعد من الأعمال، سيتم الانتهاء خلال الأسبوع
              </p>
              <motion.button
                ref={buttonRef}
                type="button"
                onClick={acknowledge}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-gold-400 to-gold-600 px-8 py-4 text-lg font-bold text-wood-950 shadow-lg shadow-gold-500/25 outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/60"
              >
                <CheckCheck className="size-5" aria-hidden />
                تمت القراءة
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
