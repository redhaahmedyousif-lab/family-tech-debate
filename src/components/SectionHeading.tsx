"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionHeading({ icon: Icon, eyebrow, title, description }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-gold-300">
        <Icon className="size-4" aria-hidden />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-extrabold leading-snug sm:text-4xl md:text-5xl">
        <span className="text-gradient-split">{title}</span>
      </h2>
      {description && (
        <p className="mt-4 text-base leading-loose text-stone-300 sm:text-lg">{description}</p>
      )}
    </motion.div>
  );
}
