"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, UserPlus, Vote } from "lucide-react";
import { teams, type TeamId } from "@/data/content";
import SectionHeading from "./SectionHeading";

const STORAGE_KEY = "family-tech-debate:poll:v1";

type PollState = {
  counts: Record<TeamId, number>;
  myVote: TeamId | null;
};

const EMPTY: PollState = { counts: { team1: 0, team2: 0 }, myVote: null };

function load(): PollState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<PollState>;
    const c = parsed.counts ?? EMPTY.counts;
    return {
      counts: { team1: Math.max(0, Number(c.team1) || 0), team2: Math.max(0, Number(c.team2) || 0) },
      myVote: parsed.myVote === "team1" || parsed.myVote === "team2" ? parsed.myVote : null,
    };
  } catch {
    return EMPTY;
  }
}

function save(state: PollState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode, quota) — the poll still works for this visit.
  }
}

const optionTheme = {
  team1: {
    ring: "border-rose-400/70 bg-rose-500/10",
    check: "bg-rose-400",
    bar: "from-rose-500 to-amber-400",
    text: "text-rose-300",
  },
  team2: {
    ring: "border-emerald-400/70 bg-emerald-500/10",
    check: "bg-emerald-400",
    bar: "from-emerald-500 to-cyan-400",
    text: "text-emerald-300",
  },
} as const;

const fmt = (n: number) => n.toLocaleString("ar-EG");

export default function Poll() {
  const [state, setState] = useState<PollState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  const update = (next: PollState) => {
    setState(next);
    save(next);
  };

  const vote = (id: TeamId) => {
    if (state.myVote === id) return;
    const counts = { ...state.counts };
    if (state.myVote) counts[state.myVote] = Math.max(0, counts[state.myVote] - 1);
    counts[id] += 1;
    update({ counts, myVote: id });
  };

  const total = state.counts.team1 + state.counts.team2;
  const pct = (id: TeamId) => (total === 0 ? 0 : Math.round((state.counts[id] / total) * 100));

  return (
    <section id="poll" className="relative px-4 py-24 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-900 to-wood-950" />
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          icon={Vote}
          eyebrow="استطلاع الرأي والتصويت التفاعلي"
          title="والآن… ما رأيك أنت؟"
          description="بعد أن تأمّلت المشهدين واستمعت إلى الحجج، انحَز إلى الموقف الذي أقنعك. يُحفظ تصويتك على هذا الجهاز."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-5 sm:p-8"
        >
          <fieldset>
            <legend className="sr-only">اختر فريقك</legend>
            <div className="flex flex-col gap-4">
              {(["team1", "team2"] as const).map((id) => {
                const selected = state.myVote === id;
                const th = optionTheme[id];
                return (
                  <motion.label
                    key={id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors sm:p-5 ${
                      selected ? th.ring : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <input
                      type="radio"
                      name="team"
                      value={id}
                      checked={selected}
                      onChange={() => vote(id)}
                      className="peer sr-only"
                    />
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-lg border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-white ${
                        selected ? `border-transparent ${th.check}` : "border-white/30"
                      }`}
                    >
                      <AnimatePresence>
                        {selected && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Check className="size-4 text-ink-950" strokeWidth={3} aria-hidden />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="font-bold leading-relaxed sm:text-lg">{teams[id].pollLabel}</span>
                  </motion.label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 space-y-5" aria-live="polite">
            {(["team1", "team2"] as const).map((id) => {
              const th = optionTheme[id];
              return (
                <div key={id}>
                  <div className="mb-2 flex items-baseline justify-between text-sm">
                    <span className={`font-bold ${th.text}`}>
                      {teams[id].name} · {teams[id].short}
                    </span>
                    <span className="tabular-nums text-stone-300">
                      <motion.span
                        key={pct(id)}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block text-lg font-black text-white"
                      >
                        {fmt(pct(id))}٪
                      </motion.span>{" "}
                      ({fmt(state.counts[id])} صوت)
                    </span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                    <motion.div
                      className={`relative h-full rounded-full bg-gradient-to-l ${th.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: ready ? `${pct(id)}%` : 0 }}
                      transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    >
                      <span className="absolute inset-0 animate-pulse bg-white/10" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-sm text-stone-400">
              إجمالي الأصوات: <span className="font-bold text-stone-200">{fmt(total)}</span>
              {state.myVote && (
                <>
                  {" "}· صوّتَّ لـ<span className={`font-bold ${optionTheme[state.myVote].text}`}>{teams[state.myVote].name}</span>
                </>
              )}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update({ ...state, myVote: null })}
                disabled={!state.myVote}
                title="يتيح لزميلك التصويت من الجهاز نفسه مع الاحتفاظ بالنتائج"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-stone-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <UserPlus className="size-4" aria-hidden />
                مشارك جديد
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("هل تريد تصفير جميع نتائج التصويت؟")) update(EMPTY);
                }}
                disabled={total === 0}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-stone-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="size-4" aria-hidden />
                تصفير
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
