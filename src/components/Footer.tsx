import { Heart } from "lucide-react";
import { REPO_URL } from "@/data/content";

// lucide-react no longer ships brand icons, so the GitHub mark is inlined.
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-wood-950 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-start">
        <div>
          <p className="font-bold text-stone-200">
            تم التطوير بواسطة <span className="text-gradient-heritage">RJ Works</span> | مشروع مادة اللغة العربية والأدب
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-stone-500 sm:justify-start">
            صُنع بشغف <Heart className="size-3.5 fill-rose-500 text-rose-500" aria-hidden /> لبيتٍ يجمعنا · IB MYP
          </p>
        </div>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-200 transition hover:text-white"
        >
          <GithubMark className="size-4" />
          <span dir="ltr">family-tech-debate</span>
        </a>
      </div>
    </footer>
  );
}
