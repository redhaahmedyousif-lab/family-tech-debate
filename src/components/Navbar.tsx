"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, Users, X } from "lucide-react";
import { navLinks } from "@/data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink-950/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-cyan-400 text-ink-950">
            <Users className="size-5" aria-hidden />
          </span>
          <span className="hidden text-sm sm:inline">التكنولوجيا والتواصل الأسري</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl text-stone-200 hover:bg-white/10 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-4 mb-3 flex flex-col rounded-2xl p-2 md:hidden"
        >
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-stone-200 hover:bg-white/10"
              >
                {l.label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}

      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-right bg-gradient-to-l from-gold-400 to-cyan-400"
      />
    </header>
  );
}
