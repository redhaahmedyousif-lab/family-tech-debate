"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronDown, Columns2, MessagesSquare, Quote, ShieldAlert, ShieldCheck } from "lucide-react";
import { teams, type Team, type TeamId } from "@/data/content";
import SectionHeading from "./SectionHeading";

type View = TeamId | "both";

const teamTheme = {
  team1: {
    icon: ShieldAlert,
    accent: "text-rose-300",
    number: "from-rose-400 to-amber-500",
    border: "border-rose-400/30",
    soft: "bg-rose-500/10",
    dot: "bg-rose-400",
  },
  team2: {
    icon: ShieldCheck,
    accent: "text-emerald-300",
    number: "from-emerald-400 to-cyan-400",
    border: "border-emerald-400/30",
    soft: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
} as const;

const tabs: { id: View; label: string; icon: typeof Columns2 }[] = [
  { id: "team1", label: "الفريق الأول", icon: ShieldAlert },
  { id: "both", label: "عرض متقابل", icon: Columns2 },
  { id: "team2", label: "الفريق الثاني", icon: ShieldCheck },
];

function ArgumentCard({ team, index, title, body }: { team: TeamId; index: number; title: string; body: string }) {
  const [open, setOpen] = useState(index === 0);
  const th = teamTheme[team];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: team === "team1" ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className={`glass overflow-hidden rounded-2xl border ${open ? th.border : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-start sm:p-5"
      >
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg font-black text-ink-950 ${th.number}`}
        >
          {(index + 1).toLocaleString("ar-EG")}
        </span>
        <span className="flex-1 text-base font-bold sm:text-lg">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-stone-400">
          <ChevronDown className="size-5" aria-hidden />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className={`mx-4 mb-4 rounded-xl p-4 leading-loose text-stone-200 sm:mx-5 sm:mb-5 ${th.soft}`}>{body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function TeamColumn({ team }: { team: Team }) {
  const th = teamTheme[team.id];
  const Icon = th.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4"
    >
      <div className={`glass rounded-3xl border p-6 ${th.border}`}>
        <div className="flex items-center gap-3">
          <span className={`grid size-12 place-items-center rounded-2xl ${th.soft} ${th.accent}`}>
            <Icon className="size-6" aria-hidden />
          </span>
          <div>
            <p className={`text-sm font-semibold ${th.accent}`}>{team.stance}</p>
            <h3 className="text-xl font-extrabold sm:text-2xl">
              {team.name}: {team.short}
            </h3>
          </div>
        </div>
        <blockquote className="mt-5 flex gap-3 border-s-2 border-white/15 ps-4 text-stone-300">
          <Quote className={`size-5 shrink-0 ${th.accent}`} aria-hidden />
          <p className="italic leading-loose">{team.quote}</p>
        </blockquote>
        <p className="mt-4 flex items-center gap-2 text-sm text-stone-400">
          <span className={`size-2 rounded-full ${th.dot}`} />
          {team.arguments.length.toLocaleString("ar-EG")} حجج
        </p>
      </div>
      <ol className="flex flex-col gap-3">
        {team.arguments.map((a, i) => (
          <ArgumentCard key={a.title} team={team.id} index={i} title={a.title} body={a.body} />
        ))}
      </ol>
    </motion.div>
  );
}

export default function Debate() {
  const [view, setView] = useState<View>("both");

  return (
    <section id="debate" className="relative px-4 py-24 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          icon={MessagesSquare}
          eyebrow="المناظرة والحجج البليغة"
          title="حين تتقارع الحُجج"
          description="فريقان يتناظران حول سؤالٍ واحد؛ اختر منبرًا لتستمع إلى حججه، أو اعرض الموقفين متقابلين لتوازن بينهما."
        />

        <LayoutGroup>
          <div role="tablist" aria-label="اختيار الفريق" className="glass mx-auto mb-10 flex w-fit max-w-full gap-1 rounded-2xl p-1.5">
            {tabs.map((t) => {
              const selected = view === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setView(t.id)}
                  className={`relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition sm:px-5 ${
                    selected ? "text-ink-950" : "text-stone-300 hover:text-white"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="debate-tab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-l from-gold-400 to-cyan-300"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <t.icon className="relative size-4" aria-hidden />
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={view === "both" ? "grid gap-8 lg:grid-cols-2" : "mx-auto max-w-3xl"}
          >
            {(view === "both" ? (["team1", "team2"] as const) : [view]).map((id) => (
              <TeamColumn key={id} team={teams[id]} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
