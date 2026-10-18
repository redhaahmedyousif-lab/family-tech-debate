"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, ChevronsDownUp, ChevronsUpDown, HelpCircle, Minus, Plus, Scale } from "lucide-react";
import { teams, type TeamId } from "@/data/content";
import SectionHeading from "./SectionHeading";

const branchTheme = {
  team1: {
    node: "border-rose-400/40 bg-rose-500/10 text-rose-100",
    line: "bg-rose-400/40",
    leafActive: "border-rose-400/60 bg-rose-500/15",
    dot: "bg-rose-400",
  },
  team2: {
    node: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
    line: "bg-emerald-400/40",
    leafActive: "border-emerald-400/60 bg-emerald-500/15",
    dot: "bg-emerald-400",
  },
} as const;

function Branch({
  id,
  open,
  onToggle,
}: {
  id: TeamId;
  open: boolean;
  onToggle: () => void;
}) {
  const team = teams[id];
  const th = branchTheme[id];
  const [focused, setFocused] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center">
      {/* stem from the root */}
      <div className={`h-8 w-0.5 ${th.line}`} />
      <motion.button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border px-5 py-4 font-bold backdrop-blur ${th.node}`}
      >
        <span className="text-start">
          <span className="block text-xs font-semibold opacity-75">{team.name}</span>
          {team.short}
        </span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10">
          {open ? <Minus className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
        </span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full max-w-sm overflow-hidden ps-6 pt-3"
          >
            {/* vertical spine for the leaves */}
            <span className={`absolute bottom-6 start-3 top-0 w-0.5 ${th.line}`} aria-hidden />
            {team.arguments.map((a, i) => {
              const isFocused = focused === i;
              return (
                <motion.li
                  key={a.title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative py-1.5"
                >
                  <span className={`absolute -start-3 top-1/2 h-0.5 w-3 ${th.line}`} aria-hidden />
                  <button
                    type="button"
                    onClick={() => setFocused(isFocused ? null : i)}
                    aria-expanded={isFocused}
                    className={`glass w-full rounded-xl border px-4 py-2.5 text-start text-sm transition ${
                      isFocused ? th.leafActive : "border-transparent hover:border-white/20"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <span className={`size-1.5 shrink-0 rounded-full ${th.dot}`} />
                      {a.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {isFocused && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="block overflow-hidden"
                        >
                          <span className="block pt-2 leading-relaxed text-stone-300">{a.body}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MindMap() {
  const [open, setOpen] = useState<Record<TeamId, boolean>>({ team1: true, team2: true });
  const allOpen = open.team1 && open.team2;

  return (
    <section id="mindmap" className="relative px-4 py-24 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-wood-950 to-ink-950" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          icon={BrainCircuit}
          eyebrow="الخريطة الذهنية التفاعلية"
          title="خيوط الفكرة في لمحة"
          description="افتح الفروع وأغلقها، واضغط على أيّ حجّة لتقرأ تفصيلها؛ هكذا تتّضح بنية النقاش ويسهل التحليل."
        />

        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen({ team1: !allOpen, team2: !allOpen })}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-stone-200 hover:text-white"
          >
            {allOpen ? <ChevronsDownUp className="size-4" aria-hidden /> : <ChevronsUpDown className="size-4" aria-hidden />}
            {allOpen ? "طيّ جميع الفروع" : "توسيع جميع الفروع"}
          </button>
        </div>

        {/* Root */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto w-fit max-w-full rounded-3xl bg-gradient-to-l from-gold-400 to-cyan-400 p-[2px] shadow-2xl shadow-black/40"
        >
          <div className="flex items-center gap-3 rounded-[calc(1.5rem-2px)] bg-ink-950 px-6 py-5 text-center">
            <HelpCircle className="size-6 shrink-0 text-gold-300" aria-hidden />
            <p className="text-lg font-extrabold sm:text-xl">هل تُهدّد التكنولوجيا التواصل الأسري الحقيقي؟</p>
          </div>
        </motion.div>

        {/* horizontal connector between the two branches */}
        <div className="mx-auto hidden h-8 w-0.5 bg-white/20 md:block" />
        <div className="mx-auto hidden h-0.5 w-1/2 bg-gradient-to-l from-rose-400/40 to-emerald-400/40 md:block" />

        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          {(["team1", "team2"] as const).map((id) => (
            <Branch key={id} id={id} open={open[id]} onToggle={() => setOpen((o) => ({ ...o, [id]: !o[id] }))} />
          ))}
        </div>

        {/* Synthesis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 flex max-w-2xl flex-col items-center"
        >
          <div className="mb-3 h-8 w-0.5 bg-gradient-to-b from-white/0 to-gold-400/60" />
          <div className="glass flex items-start gap-4 rounded-3xl border border-gold-400/30 p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
              <Scale className="size-6" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-gold-400">نقطة الالتقاء</p>
              <p className="mt-1 leading-loose text-stone-200">
                يتّفق الفريقان ضمنًا على أنّ <strong className="text-gold-300">الاعتدال وتنظيم الوقت</strong> هما الحَكَم؛
                فالتقنية بلا ضابطٍ تبني الجدران، وبحسن التدبير تمدّ الجسور.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
