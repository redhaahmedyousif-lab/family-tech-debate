"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { moderation } from "@/data/content";

export default function ModerationBanner() {
  return (
    <section aria-labelledby="moderation-heading" className="relative px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-l from-gold-400 via-gold-500/60 to-cyan-400 p-[2px] shadow-2xl shadow-black/40"
      >
        <div className="relative overflow-hidden rounded-[calc(2rem-2px)] bg-ink-950 px-6 py-10 text-center sm:px-12">
          <div aria-hidden className="absolute -right-20 -top-20 size-60 rounded-full bg-gold-500/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -left-20 size-60 rounded-full bg-cyan-500/20 blur-3xl" />

          <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-cyan-400 text-ink-950">
            <Scale className="size-7" aria-hidden />
          </span>
          <p className="relative mt-4 text-sm font-bold tracking-wide text-gold-300">الخلاصة الجوهرية</p>
          <h2
            id="moderation-heading"
            className="relative mx-auto mt-3 max-w-3xl text-xl font-extrabold leading-loose sm:text-2xl md:text-3xl md:leading-[1.8]"
          >
            <span className="text-gradient-split">{moderation.headline}</span>
          </h2>
          <blockquote className="relative mx-auto mt-6 max-w-2xl border-t border-white/10 pt-6 leading-loose text-stone-300">
            «{moderation.quote}»
          </blockquote>
        </div>
      </motion.div>
    </section>
  );
}
