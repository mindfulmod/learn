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
