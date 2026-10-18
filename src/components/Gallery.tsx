"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Images, Flame, MonitorSmartphone, Sparkles, Hand } from "lucide-react";
import { scenes, type Scene } from "@/data/content";
import SceneImage from "./SceneImage";
import SectionHeading from "./SectionHeading";

const toneStyles = {
  heritage: {
    ring: "hover:ring-gold-400/60 data-[active=true]:ring-gold-400/60",
    badge: "bg-gold-400/15 text-gold-300 border-gold-400/30",
    chip: "bg-wood-900/80 border-gold-400/40 text-gold-300",
    overlay: "from-wood-950 via-wood-950/60",
    glow: "bg-gold-500/30",
    icon: Flame,
  },
  tech: {
    ring: "hover:ring-cyan-400/60 data-[active=true]:ring-cyan-400/60",
    badge: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
    chip: "bg-ink-900/80 border-cyan-400/40 text-cyan-200",
    overlay: "from-ink-950 via-ink-950/60",
    glow: "bg-cyan-500/30",
    icon: MonitorSmartphone,
  },
} as const;

function SceneCard({ scene, index }: { scene: Scene; index: number }) {
  const [active, setActive] = useState(false);
  const t = toneStyles[scene.tone];
  const Icon = t.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onClick={() => setActive((a) => !a)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      data-active={active}
      className={`glass group relative cursor-pointer overflow-hidden rounded-3xl ring-1 ring-transparent transition-shadow duration-500 focus:outline-none ${t.ring}`}
    >
      <div className={`pointer-events-none absolute -top-20 left-1/2 size-60 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-500 ${t.glow} ${active ? "opacity-100" : "opacity-0"}`} />

      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.div className="h-full w-full" animate={{ scale: active ? 1.07 : 1 }} transition={{ duration: 0.8 }}>
          <SceneImage src={scene.src} alt={scene.alt} variant={scene.id} />
        </motion.div>
        <div className={`absolute inset-0 bg-gradient-to-t ${t.overlay} to-transparent`} />

        <span className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur ${t.badge}`}>
          <Icon className="size-3.5" aria-hidden />
          {scene.label}
        </span>

        {/* Hover highlights */}
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap justify-start gap-2">
          <AnimatePresence>
            {active &&
              scene.highlights.map((h, i) => (
                <motion.span
                  key={h}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 22 }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold backdrop-blur-md ${t.chip}`}
                >
                  <Sparkles className="size-3.5" aria-hidden />
                  {h}
                </motion.span>
              ))}
          </AnimatePresence>
          {!active && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-stone-300 backdrop-blur">
              <Hand className="size-3.5" aria-hidden />
              مرّر أو اضغط لاكتشاف الدلالات
            </span>
          )}
        </div>
      </div>

      <div className="relative p-6 sm:p-7">
        <p className={`text-sm font-semibold ${scene.tone === "heritage" ? "text-gold-400" : "text-cyan-300"}`}>
          {scene.tagline}
        </p>
        <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          {scene.label}: <span className={scene.tone === "heritage" ? "text-gradient-heritage" : "text-cyan-200"}>{scene.title}</span>
        </h3>
        <p className="mt-3 leading-loose text-stone-300">{scene.description}</p>
      </div>
    </motion.article>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="relative px-4 py-24 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-wood-950 to-ink-950" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          icon={Images}
          eyebrow="معرض المقارنة البصرية"
          title="مشهدان… وحكايتان عن البيت"
          description="صورتان لأسرةٍ واحدة في زمنين مختلفين: الأولى تنطق بالحضور، والثانية تهمس بالغياب. تأمّل التفاصيل وتتبّع الدلالات."
        />

        <div className="relative grid gap-8 md:grid-cols-2">
          {scenes.map((s, i) => (
            <SceneCard key={s.id} scene={s} index={i} />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
            className="pointer-events-none absolute left-1/2 top-[30%] z-10 hidden -translate-x-1/2 md:block"
          >
            <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-cyan-400 p-[2px] shadow-xl shadow-black/50">
              <div className="grid size-full place-items-center rounded-full bg-ink-950 text-sm font-black">مقابل</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
