# التكنولوجيا والتواصل الأسري — Technology & Family Communication

منصّة تفاعليّة في مادة اللغة العربية والأدب (IB MYP) تناقش سؤال:
**«هل تُهدّد التكنولوجيا التّواصُلَ الأُسَرِيَّ الحَقِيقِيَّ؟»**

🌐 **الموقع:** https://redhaahmedyousif-lab.github.io/family-tech-debate/

Built with Next.js (App Router), Tailwind CSS v4, Framer Motion and Lucide icons. RTL layout with the Cairo font.

## Sections
1. **Hero** — title, subtitle and CTAs that scroll to the gallery and poll.
2. **Visual comparison gallery** — the traditional vs. digital family scenes, with highlights revealed on hover/tap.
3. **Debate** — the two teams' arguments as tabs (Team 1, Team 2, or side-by-side), each argument expandable.
4. **Mind map** — collapsible branches for each team, plus a synthesis node.
5. **Poll** — vote for a team; animated percentage bars, saved in `localStorage`. "مشارك جديد" lets another student vote on the same device; "تصفير" resets the tally.

## Images
Put the two photos here:

- `public/images/traditional-family.jpg`
- `public/images/digital-family.jpg`

Until they exist, the gallery shows animated SVG illustrations instead.

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Content (arguments, captions, labels) lives in `src/data/content.ts`.

---
تصميم وتطوير: رضا أحمد يوسف — ساعة صفاء | مادة اللغة العربية والأدب
