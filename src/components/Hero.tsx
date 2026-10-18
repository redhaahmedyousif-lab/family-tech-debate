"use client";

import { motion } from "framer-motion";
import { ChevronDown, Eye, Smartphone, Vote, Landmark } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-16">
      {/* Background: heritage warmth on the right (start), tech cool on the left (end) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-wood-900 via-ink-900 to-ink-950" />
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div
        aria-hidden
        className="absolute -right-32 top-10 -z-10 size-[28rem] rounded-full bg-gold-500/25 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -left-32 bottom-0 -z-10 size-[26rem] rounded-full bg-cyan-500/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating emblems */}
      <motion.div
        aria-hidden
        className="glass absolute right-[8%] top-[22%] hidden rounded-2xl p-4 text-gold-300 lg:block"
        animate={{ y: [0, -14, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Landmark className="size-8" />
      </motion.div>
      <motion.div
        aria-hidden
        className="glass absolute bottom-[22%] left-[8%] hidden rounded-2xl p-4 text-cyan-300 lg:block"
        animate={{ y: [0, 14, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Smartphone className="size-8" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl px-4 text-center sm:px-6"
      >
        <motion.span
          variants={item}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-stone-200 sm:text-sm"
        >
          <span className="size-2 animate-pulse rounded-full bg-gold-400" />
          مشروع اللغة العربية والأدب · IB MYP
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-8 text-4xl font-black leading-[1.5] sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.45]"
        >
          <span className="text-stone-400">«</span>
          <span className="text-gradient-split">هل تُهدّد التكنولوجيا التّواصُلَ الأُسَرِيَّ الحَقِيقِيَّ؟</span>
          <span className="text-stone-400">»</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-base leading-loose text-stone-300 sm:text-lg md:text-xl"
        >
          منصّة تفاعليّة تحليليّة تُناقش أثر التقنية على الروابط الأسرية بين عراقة الماضي وواقع العصر الرقمي.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            href="#gallery"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-gold-400 to-gold-600 px-7 py-4 font-bold text-wood-950 shadow-lg shadow-gold-500/25 sm:w-auto"
          >
            <Eye className="size-5 transition group-hover:scale-110" aria-hidden />
            استكشف المشهدين
          </motion.a>
          <motion.a
            href="#poll"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="glass group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 font-bold text-cyan-200 hover:text-white sm:w-auto"
          >
            <Vote className="size-5 transition group-hover:rotate-12" aria-hidden />
            شارك في التصويت
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#gallery"
        aria-label="انتقل إلى المعرض"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-400 hover:text-gold-300"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="size-7" />
      </motion.a>
    </section>
  );
}
