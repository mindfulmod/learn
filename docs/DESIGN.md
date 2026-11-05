# Rahnuma design brief

This is the product's home for a 9 to 18 year old. It must feel like a modern software suite they chose, not a portal a school gave them.

## What the research says

Synthesised from Nielsen Norman Group guidance on children and teens, Duolingo's path redesign writing, analyses of Brilliant and Headspace home screens, and current bento-layout practice.

1. **One obvious next action.** Brilliant centres a "pick up where you left off" card above everything else. Headspace surfaces a single recommended session. Duolingo turned a tree of choices into a path with one next node. Kids do not want a menu; they want to know what to do now.
2. **Status always visible.** Streak, level and avatar live in a persistent header, never inside a page.
3. **Progress is a place, not a number.** A path with nodes beats a percentage. The student should see where they stand and what is next on the map.
4. **Teens reject anything childish.** Preteens want vivid; teens want clean. The overlap is bold type, generous space, vivid accents on a calm base, abstract rather than cartoon illustration, dark mode available, and copy that never talks down.
5. **Short, scannable copy.** Teens scan. Eight words per line beats a paragraph. Reading level around grade 6.
6. **Feedback for every action.** Immediate, sensory, small: a number ticking up, a tile lighting, a brief celebration on completion.
7. **Motivation beyond points.** Points, badges and levels help a little; missions with a story arc, autonomy and visible mastery sustain it. Streaks should be low-pressure (no shame, easy recovery).
8. **Navigation.** Persistent sidebar on wide screens with the full hierarchy visible; the same five sections as bottom tabs on phones, in the same order. Settings and secondary items off the primary nav.
9. **Bento for the home.** Four-column grid; tile size signals importance (2x2 hero, 2x1 wide, 1x1 compact); uniform 16px gap; 20 to 24px radii; collapses to two then one column.
10. **Big targets.** 48px minimum for anything tappable; 56px for primary actions.

## Principles for Rahnuma

- **Today first.** The home screen answers "what should I do right now" in one tile.
- **The path is the product.** The journey from this grade to the chosen future is visible on the home screen, on the goal page and in the preview. Milestones are nodes; the current node glows.
- **Earn, don't grind.** XP for every meaningful action, levels with names (Explorer, Pathfinder, Navigator, Trailblazer, Voyager, Pioneer), three weekly missions, badges for firsts. Streaks celebrate but never nag.
- **Calm base, electric accents.** Soft neutral surfaces; the brand gradient and area hues used only where attention belongs.
- **Nothing cartoon.** Abstract geometric illustration built from the tint system (orbs, rings, arcs). Icons are lucide, consistent weight.
- **Never school.** No grades-as-judgement, no red marks, no "incomplete". Language is "developing", "next up", "try again tomorrow".

## Layout system

### App shell
- `≥ 1024px`: fixed left sidebar (256px) with brand, five primary links (Today, My Path, Explore, Practice, Progress), a level card at the bottom and a settings link. Content column max 1200px with 32px gutters. A slim status bar at the top of the content: greeting, streak chip, XP chip, avatar.
- `< 1024px`: top status bar (brand mark, streak, XP, avatar) and a five-item bottom tab bar in the same order. 16px gutters.
- Quiz and preview enter "focus mode": shell hidden, single column, one exit.

### Home (Today) bento
```
[ Next step  2x2 ][ Streak 1x1 ][ Level 1x1 ]
[ Next step      ][ Path strip 2x1            ]
[ Goal 2x1               ][ Missions 1x1 ][ Strengths 1x1 ]
[ Coach 3 cards, horizontal scroll on phones            ]
```

### Page header
Every page uses the same header: kicker, title, one-line lead, optional primary action on the right. No hero banners on inner pages.

### Components
- `Tile`, `IconTile`, `Orb` (abstract illustration), `Ring` (progress ring), `PathStrip` (horizontal milestone chain), `StatChip` (streak, XP), `MissionList`, `XpToast`, `Celebration`.

## Motivation model

- XP: 5 per correct answer, 2 per attempted; 40 bonus for 80%+ rounds; discovery 60; finder 40; preview 15 (first time per career); goal set 25; streak day 10.
- Levels: 0, 150, 400, 800, 1400, 2200, 3200 XP → Explorer, Pathfinder, Navigator, Trailblazer, Voyager, Pioneer, Legend.
- Missions (weekly, three at a time): practise a goal subject, preview a career, two rounds in a row, beat your accuracy, try a new subject.
- Badges: first round, first preview, goal set, 7-day streak, strong subject, finder complete, discovery complete.

## Copy voice

Second person, warm, concrete. "Next up: 8 Biology questions, about 6 minutes." Never "You failed", never "incomplete", never "kids".

## Density and age modes (added after review of the Raah prototype)

What the Raah prototype gets right and we adopt: one sentence and one button on the home screen; interests as tappable pills instead of a quiz; paths named as aspirations ("Care for people") not job titles; teach-then-try activities (concept, worked example, then questions, with hints and read-aloud); numbered 1-2-3 next steps; pastel tiles so every card looks different; "no timer, no penalty" tone.

### Two modes
- **Junior** (grades 1-8, or chosen in Settings): one idea per screen. Home = hero sentence + one button, "What are you curious about?" pills, three paths, three numbered next steps, one coach line. No percentages, no XP arithmetic in copy, no fit scores. Bigger type, read-aloud on every long text. Explore shows nine paths as pastel tiles; a path opens two or three careers as one-line cards with a Preview. Preview is shortened to three steps (meet, journey, first step). Practice starts with a 3-sentence lesson and an example before questions.
- **Senior** (grades 9-12): the full suite, but every lead is one line, details collapse behind "More", and tiles carry one number each.

### Word budget
- Hero: title ≤ 6 words, lead ≤ 12 words.
- Tile: label + one line (≤ 10 words).
- Card body on junior: ≤ 14 words.
- Coach note: title ≤ 7 words, body ≤ 18 words.

### Differentiation
- Every primary section has a hue (Today violet, My Path amber, Explore pink, Practice mint, Progress green) applied to its header art, tiles and active nav.
- Card forms vary on purpose: gradient hero, pastel tile, plain white card, bordered row. Never a screen of identical white cards.
- Paths use distinct pastel tiles and icons; subjects use their area hue; careers use their cluster hue.

## Iteration 4: desktop composition, picture finder, pay, cohesion

Grounded in docs/RESEARCH.md. Four problems named by the product owner: still text heavy; feels like a phone app on desktop; salary missing; parts feel bolted on (a quiz ends on a page that does not feel like the app).

### Desktop composition (≥ 1024px)
- **Context rail.** A 320px right rail on Today, Practice (picker) and Progress holds the things that were tiles: streak dots, this week's missions (senior) or three small next steps (junior), one coach line. The main column is then free for the one thing that matters on that screen.
- **Master-detail on Explore.** Left column (320px) lists the nine paths; the right pane shows the selected path's careers; selecting a career shows its detail in the same pane. No page jumps. Phones stack and drill down.
- **Preview as a drawer.** On desktop the Future Preview slides in from the right (560px) over the content, so the sidebar and page stay visible. Phones keep the bottom sheet.
- **Quiz keeps the shell on desktop.** Focus mode removes only the rail and status chips on wide screens; the sidebar stays so the student never leaves the app. Phones keep full focus.
- **Line length capped** at about 65 characters everywhere text runs long.

### Cohesion rules
- One `Screen` component for every page: header, main, optional rail. No page builds its own frame.
- One primary button per screen. Secondary actions are quiet.
- Every flow ends with a hand-off, not a dead end: the results screen shows "Next up" (from nextStep) and "Back to Practice"; the finder ends in paths; the preview ends in "Set as my goal" or "Explore another".
- Shared tokens for motion: 200ms ease-out for state, 350ms for step transitions, one animation at a time.

### Picture finder (grades 1 to 5)
- Eight rounds. Each shows two large illustrated scenes (built from the Orb system and lucide icons, no photographs) and a spoken prompt "Which would you rather do?" with a speaker button. No reading required; one short label under each scene for readers.
- Each scene maps to career clusters with weights, like the text finder. Results: three illustrated path tiles with one word each ("Helper", "Builder", "Explorer") and two buttons: "Peek" (junior preview) and "Try it" (practice in a related subject).
- Routes: /finder chooses the picture finder when grade ≤ 5 (or Settings sets Junior and grade ≤ 5). Answers persist in the same `finder` field with a `picture:` prefix on option ids so the text finder and picture finder never mix.

### Pay
- `PayBand` component: a horizontal band from entry low to experienced high in PKR per month, with a marker for the national median (about Rs 70k) and the label "Estimate, Pakistan 2025". Shown in career detail, the Explore detail pane and preview step 4 (senior).
- Juniors see a three-coin scale ("Pays OK", "Pays well", "Pays very well") derived from the experienced midpoint: under 200k, 200k to 500k, above 500k.

### Word budget (unchanged) plus
- Junior screens have no lead text under headers at all.
- A card never has more than one sentence of body on junior and two on senior.

## Iteration 5: gameplay

Grounded in the full-text reading in docs/RESEARCH.md ("Read in full"). Audit of iteration 4 at 1440px on 5 Nov 2026: the grade 3 home had 142 words and 17 clickable things, its primary action was a 24-question text quiz, the rail repeated the hero, and Practice showed a grade 3 child tabs for grades 6 to 12 plus an adult footnote. The grade 10 My Path was a 260-word document. Every screen was a stack of equal white cards. The research says each of those is a specific, named failure, so this iteration is a redesign of the play loop by age band rather than another density pass.

### Four age bands (NN/g: narrow bands or nothing)
| Band | Grades | Ages | Reads | Home is | Progress is |
|---|---|---|---|---|---|
| early | 1 to 2 | 6 to 7 | not yet | the Town | stickers |
| primary | 3 to 5 | 8 to 10 | tentatively | the Town | stickers |
| middle | 6 to 8 | 11 to 13 | scans | quest card + paths | level names, no XP numbers |
| senior | 9 to 12 | 14 to 17 | scans, 6th-grade level | resume card + plan | XP, accuracy, badges |

`ageBandFor(profile)` in engine/mode.ts. The existing junior/senior density mode stays (junior = early, primary, middle) so nothing already built breaks; the band adds behaviour on top. Settings can still force junior or senior density.

### Grades 1 to 5: Rahnuma Town
The whole band plays one spatial game. Pre-readers navigate by place (NN/g: spatial metaphors are "very helpful for pre-readers"; Xello: Career Town), every word is tappable to hear (Khan Kids), and progress is a thing you can see fill up (Khan Kids' truck, Sago's wordless world).

- **The Town is the home screen and the Explore screen.** A full-width flat illustrated map (inline SVG, schematic not realistic, per the meta-analysis) with nine places, one per path: Hospital (Healer), Workshop (Builder), Game Studio (Inventor), Market (Leader), Court (Defender), Theatre (Creator), School (Helper), Airfield (Protector), Garden Lab (Explorer). Each place is a tinted building silhouette in its path hue with the path icon and a one-word label. Tap target at least 80px. The map fills the desktop main column and scales to the phone; nothing scrolls on the first screen.
- **Nav for grades 1 to 5 is three items**: Town, Practice, Stickers. My Path and Explore are hidden for this band (redundant navigation is "very confusing" for children). The context rail is never shown for this band; the week shows as seven suns in the Town header, today's filled when active.
- **The finder is the signpost.** Before the finder is played, a signpost in the middle of the Town says "Which would you rather do?" with one Play button and a speaker. After it, the three result places glow with a star. Places are always tappable, finder or not (children mine-sweep; let them).
- **Visit.** Tapping a place opens a Visit panel (side drawer on desktop, bottom sheet on phones): a big Scene of a person doing the work (SceneSpec reused from the picture finder), the one word, a spoken line ("A doctor helps sick people get better"), and two big buttons: **Try it** and **Peek**. Peek is the existing three-step junior Future Preview for the path's lead career.
- **Try it** is a three-question round from the existing grade 1 to 5 item bank in the subject that place uses (Hospital and Garden Lab: science; Workshop, Game Studio, Market: maths; Theatre, School, Court: English; Airfield: maths), framed by one kicker line ("Help the doctor") and nothing else. Wrong answers show the right answer and the one-line explanation immediately. Finishing awards the place's **sticker**, which appears on the map and in the Sticker book, with the mascot celebration and a ding. Taps count toward the week suns and activeDays like any round.
- **Stickers** replace Progress for this band: nine slots, earned ones in colour, others as grey outlines, a count "4 of 9", and a Play again for the finder. No percentages, no XP, no level ladder.
- **Practice** for this band: four big picture tiles (English, Maths, Science, Social Studies) with the subject icon on its hue, no grade tabs, no footnote, tap goes straight into the lesson-then-round flow that exists.
- Copy: labels of five words or fewer; one spoken sentence per place; no paragraphs anywhere in the band. Every text node in Town, Visit and Stickers is wrapped so a tap reads it aloud.

### Grades 6 to 8: quests
Keep the current junior home shape but fix the audit failures: the hero is the resume card (below); the rail shows streak and this week only and never repeats the hero; Explore stays master-detail; Practice hides other grade bands behind "Other grades". Level names, no XP arithmetic.

### Grades 9 to 12: plan
- **Home is a state router** (screensdesign). One primary card chosen by state, in this order: new (play the finder); finder done, no goal (pick a goal, show the top match); goal not previewed (peer into your future); goal set, never practised (first round in the goal's weakest must subject); practised before (resume card: subject, rounds so far, last accuracy, "Next round"); done today (a calm "You're done for today" with the streak and one optional extra); evening and not yet active today (streak at risk: "Keep your streak, 5 minutes"). `homeState(state, now)` in engine/xp.ts returns the card; `nextStep` stays for the hand-offs. The resume card always shows object, unit, progress and a verb so the student can predict what Continue opens.
- **My Path is a road, not a document.** A winding SVG road with one node per milestone (age badge, icon, title of three words or fewer). The current node is highlighted; tapping a node shows its one-line detail in a side card on desktop and below the road on phones. The rail keeps "This year" and "Groups to choose", trimmed to one line each. Descriptive step names ("Finish Matric"), never codes.
- **Practice**: on the first visit choose a daily time (5, 10 or 15 minutes, which sets the round to 4, 8 or 12 questions; wondering.app pattern) and before each round a plain Easy / Normal / Hard choice (Smeddinck: players want manual choice; adaptivity continues inside the round). Both are remembered in `prefs` and changeable in Settings. Other grade bands sit behind "Other grades". No "+80 XP" badge on every tile; the earnable XP appears once in the header line.
- **Streak with forgiveness** (Duolingo): the streak survives one missed day in any seven; the status chip shows a small shield on the day it was used. Milestones at 3, 7, 14 and 30 days trigger the Celebrate overlay once each.
- **Progress zero state**: never "0%"; before any round the accuracy card says "No rounds yet" with a Start button.

### Cohesion: the Duolingo core-tabs fix
- **Header tiers by purpose.** Tier 1, Today and Town: no tinted banner; greeting or map only. Tier 2, My Path, Explore, Practice picker, Progress: compact tinted header (about 96px) with the title, section art at 64px, a lead of at most ten words on senior and none on junior. Tier 3, quiz, visit, career detail: a plain title row.
- **One type system**: display 32, 24 and 20; body 16; small 14; kicker 12 uppercase. No other sizes.
- **Whitespace, not containers.** No card inside a tinted card. The rail is plain groups separated by space, not a stack of white cards. Course tiles and path tiles carry colour; everything else is quiet.
- **One primary button per screen**, secondary actions quiet; every flow still ends in a hand-off.

### Copy rules by band
- early and primary: five words per label, one spoken sentence per thing, read-aloud on tap.
- middle: ten words per line, no footnotes.
- senior: 6th-grade reading level, sentences of fourteen words or fewer, no footnotes, no "kids".

### Data model additions
- `StudentState.stickers: string[]` of cluster ids (the place visited and tried).
- `StudentState.prefs: { dailyMinutes: 5 | 10 | 15; difficulty: 'easy' | 'normal' | 'hard' }`, defaulting to 10 and normal.
- Streak forgiveness is computed, not stored.

### Not in this iteration
- New item types (order the steps, fill the blank) need authored data for 180 items and are deferred; the variety for now comes from lesson, round, visit and finder.
- A parent view (Taleemabad's portal) is deferred until there is something to report.
