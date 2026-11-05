# Rahnuma (رہنما) · Learn

A learning guide for students in the Pakistani education system, from grade 1 to pre-college. It helps a student:

- **See their curriculum** for any grade on their board: National (SNC, Matric, Intermediate), Cambridge (O/A Level) or AKU-EB, with the subjects, units and topics each year covers and which group or stream each path requires.
- **Set a career goal** and get a roadmap: the group to pick at Matric and Intermediate, must-have and helpful subjects, entrance tests (MDCAT, ECAT, NET, LAT, CSS, ISSB and more), degrees and institutions, with stage-by-stage focus points.
- **Find a direction when they have none.** The Career Finder is an 8-question "would you rather" game that surfaces three career clusters and the careers inside them, each with a one-tap preview.
- **Peer into their future.** Any career opens a five-step Future Preview: what the job is and a day in that life; a personal journey with the student's age at every milestone (choosing a group, board exams, entrance test, graduation, first job, ten years in); what it takes (subjects, strengths, skills); life in the job (workplaces, pay bands, demand, the honest hard parts); and a first step to try this month.
- **Discover what suits them** through a 24-statement interest questionnaire that produces a trait profile (maker, thinker, creator, helper, leader, organiser) and sharpens the finder and career rankings.
- **Practise and get feedback.** Adaptive eight-question rounds per subject with explanations for every answer. Results build a strength profile per subject and per learning area, track trends, surface weak topics, and feed a rule-based coach that tells the student what to work on next.

Everything is stored in the browser (no login, no server). Progress can be exported and imported as a JSON file.

## Stack

- React 19, TypeScript, Vite
- `react-router-dom` with hash routing so it works on GitHub Pages
- No backend, no AI calls. The recommendation engine is deterministic and lives in `src/engine`.

## Project layout

```
src/
  data/        boards, subjects and syllabus outlines, streams, careers, career life details, finder scenarios, discovery questions, quiz items
  engine/      discovery scoring, finder scoring, journey builder, strength profile, career fit, goal plan, adaptive quiz, feedback rules
  store/       localStorage-backed state (profile, goals, discovery, finder answers, previews, attempts)
  pages/       Onboarding, Dashboard, Curriculum, Careers, CareerDetail, Finder, Discover, Practice, Progress, Settings
  components/  layout, FuturePreview modal and small UI pieces
  design.ts    icon and colour identity per subject area, career cluster and trait (lucide icons)
```

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/learn/
npm run lint
npm run build      # outputs dist/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. One-time setup in the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The site is then served at `https://mindfulmod.github.io/learn/`.

For a custom domain or root hosting, build with `VITE_BASE=/ npm run build`.

## Extending the content

- Add a subject: append to `src/data/subjects.ts` with its boards, grade range and units.
- Add a stream or group: `src/data/streams.ts`, referencing subject ids.
- Add a career: `src/data/careers.ts`, with pathways for all three boards, trait and area weights, and a roadmap.
- Add practice questions: `src/data/quizzes.ts` using the `q()` helper. Topics should match the unit topic names in `subjects.ts` where possible so feedback can point to them.

## Roadmap

- Accounts and cross-device sync (Supabase or similar)
- An LLM-powered tutor for open-ended feedback and explanations
- Urdu interface
- Larger question banks per chapter and past-paper style practice
- Parent and teacher views
