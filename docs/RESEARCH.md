# Research synthesis: keeping students engaged

Compiled from a sweep of about 200 links across 27 searches on 5 November 2026. Only sources that contributed a usable finding are listed. Page fetches are blocked in this environment, so findings come from search extracts and indexed abstracts; where a figure is vendor-reported or unverified it is marked.

## The ten findings that drive the design

1. **Competence, autonomy, relatedness predict engagement.** Across classroom and e-learning studies, perceived competence and autonomy explain roughly half the variance in cognitive engagement; relatedness often has the largest single effect. Clear progression and immediate feedback are the levers for competence; flexible pacing and choice for autonomy. [1][2][3][4]
2. **Games help when the design, not the medium, is good.** The largest meta-analysis of game-based learning (K-16, 69 studies) finds a moderate positive effect (about 0.33) and, critically, that simpler visual designs performed as well as or better than complex ones. Polish matters less than mechanics and feedback. [5][6]
3. **Flow needs three things**: clear goals, challenge matched to skill, and unambiguous immediate feedback. Automatic difficulty adjustment alone does not improve experience; players want control over difficulty too. Immediate feedback motivates the right-answerers and can frustrate the wrong-answerers, so wrong-answer feedback must teach, not judge. [7][8][9][10]
4. **Leaderboards hurt the bottom half.** Repeated findings: mid and high ranked students benefit, low ranked and anxious students disengage. Social comparison is not a safe default for children; progress against self is. [11][12][13][14]
5. **Rewards are double-edged.** Decades of overjustification research are mixed; badges help when read as goal cues and hurt when they become the point. Keep rewards legible as progress markers, not currency. Khan Academy deliberately does not make points the centrepiece. [15][16][17][18]
6. **Text is a weak channel for children.** Chiasson and Gutwin: text conveys little to children; visual and audio cues work when clear and age-appropriate; children repeat actions until they see a result, so feedback must be immediate. Khan Academy Kids minimises written language in favour of icons and animation; every sound must have a purpose or it steals attention. Pictorial interest inventories (PICS, PDII) are validated, essentially language-free RIASEC measures for young children. [19][20][21][22][23][24]
7. **Teens reject childish, preteens want vivid.** NN/g: teens have lower reading levels than designers assume, scan rather than read, and are insulted by "kids"; tweens reject anything that looks childish. Clean lines, modern type, vivid accents, short lines of about 45 to 60 characters, left aligned, 1.5 line height. [25][26][27][28][29]
8. **One next action beats a menu.** Brilliant centres "pick up where you left off"; Headspace surfaces one session; Duolingo's path replaced a tree of choices and, by the company's own study, produced equal or better proficiency. Streaks drive next-day retention but need forgiveness (freezes, no shame). [30][31][32][33][34][35]
9. **Stories, avatars and identity sustain engagement where points fade.** Xello K-2 wraps career exploration in a mystery story; Prodigy makes the maths the game; children build avatars for self-representation and identity experimentation. Narrative and ownership are cheaper than they look and more durable than streaks. [36][37][38][39]
10. **Desktop is not a tall phone.** The common failure is designing one column and letting it stretch. Large screens want column-drop layouts, master-detail side by side, persistent panels, and capped line length (50 to 75 characters). Progressive disclosure keeps the first screen light while detail stays one click away; hidden controls must not jump around. [40][41][42][43][44][45]

## Supporting findings

- Onboarding: define the one action that predicts return and make session one deliver it; defer accounts and tutorials until after it; use empty states as onboarding. [46][47][48]
- Spaced retrieval works for children and adolescents regardless of age; tests inside spaced practice amplify the effect; retrieval should follow teaching, not replace it. [49][50][51][52]
- Open-ended play (Toca Boca, Sago Mini): no instructions, no rules, no scores for the youngest; our grades 1 to 5 should feel like exploring, not testing. [53][54][55]
- Micro-interactions: keep them brief, one at a time, purposeful; they counter change blindness; sound optional. [56][57][58]
- Pakistan context: Taleemabad tested every animated episode for engagement and discarded 4,000 minutes that did not perform; content in Urdu and English; adaptive repetition of weak skills; KaiOS and feature-phone reach. Parents with limited schooling may confuse children if asked to teach; parent features should inform, not instruct. Offline-first and low-end Android matter. [59][60][61][62][63]
- Career exploration for young children: Xello splits K-2 and 3-5 into different interfaces; 3-5 begins with "About me", then careers, then goals; short descriptions, avatars, self-paced missions. [36][64]
- Salary data for Pakistan is noisy: aggregators give software engineers about PKR 50k to 130k entry and 250k to 500k senior; doctors about 60k to 280k; teachers 30k to 130k; national median around PKR 70k. Treat all figures as estimates and label them. [65][66][67][68]

## What this means for Rahnuma (decisions)

- **Grades 1 to 5 get a picture finder**: two large scenes per question, a spoken prompt, no reading required; results are three illustrated paths with one word each. Validated pictorial RIASEC instruments justify the approach. [21][22]
- **Desktop uses the width**: a persistent context rail (streak, this week, one coach line) beside the main column; Explore as master-detail; the Future Preview as a side drawer on desktop so the app never disappears behind a modal. [40][41][42]
- **Cohesion over novelty**: one Screen component for every page, one primary action per screen, results rendered inside the shell with a "next up" hand-off so the loop never dumps the student at a dead end. [30][8]
- **Progress against self, never against others**: no leaderboards. Streaks with forgiveness. Badges as goal cues. Level names, not point totals, for juniors. [11][15][33]
- **Teach, then test, then tell them what it meant**: micro-lesson, retrieval, a one-line interpretation and the next step. [49][8]
- **Pay shown as a band against the national median**, labelled as an estimate, in rupees per month. For juniors, a three-coin scale. [65][68]

## Sources

1. Niemiec and Ryan, Autonomy, competence and relatedness in the classroom, Theory and Research in Education 2009. https://eric.ed.gov/?id=EJ845602
2. Chiu, Applying SDT to explain student engagement in online learning, JRTE 2021. https://www.tandfonline.com/doi/full/10.1080/15391523.2021.1891998
3. SDT, social support, self-regulated learning and flow in self-directed e-learning, PMC 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC11979257/
4. Learners' psychology and engagement in mobile language apps through SDT. https://www.academia.edu/145270356/
5. Clark, Tanner-Smith and Killingsworth, Digital games, design and learning: a systematic review and meta-analysis, RER 2016. https://sri.com/publication/digital-games-design-and-learning-a-systematic-review-and-meta-analysis-executive-summary/
6. Joan Ganz Cooney Center on the same meta-analysis. https://joanganzcooneycenter.org/?p=16779
7. Shute, Ke and Wang, Assessment and adaptation in games for learning. https://myweb.fsu.edu/vshute/pdf/assess_adapt.pdf
8. Smeddinck et al., How to present game difficulty choices, CHI 2016. https://www.cs.mcgill.ca/~jeromew/data/COMP766/CHI2016/p5595-smeddinck.pdf
9. Flow in serious games review. https://trepo.tuni.fi/bitstream/10024/126163/1/151_747_1_PB.pdf
10. Immediate feedback and frustration in classroom games (Space Race study). https://periodicos.ufrn.br/ambiente/article/download/29394/15875/98321
11. Leaderboard rank and low performers, EFL thesis, USQ. https://research.usq.edu.au/download/7c0465609f76e20d1b49e9e63c481a1fedb32f72b0c84ad2074576702c719e64/5091829/
12. Leaderboards and maths anxiety in a primary maths game. https://par.nsf.gov/servlets/purl/10510520
13. Gamifying mathematical physics via leaderboard feedback. https://upcommons.upc.edu/entities/publication/9f5fa0ca-5da2-45d8-a3b6-6d5647caa2aa
14. Social comparison in gamified EFL writing, Frontiers 2026. https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2026.1694621/pdf
15. Gamification chapter, MIT Lifelong Kindergarten readings. https://lcl.media.mit.edu/resources/readings/chapter3-gamification.pdf
16. Rewards in the early years, Famly. https://www.famly.co/blog/rewards-early-years
17. Motivating children without rewards, Psychology Today. https://psychologytoday.com/intl/blog/the-baby-scientist/201806/motivating-children-without-rewards
18. Khan on game mechanics and motivation, HuffPost. https://www.huffpost.com/entry/motivating-students-and-t_b_1275441
19. Chiasson and Gutwin, Design principles for children's technology. https://chorus.scs.carleton.ca/wp-content/papercite-data/pdf/chiasson2005design-tr.pdf
20. Soni et al., Touchscreen interaction design recommendations for children, IDC 2019. https://init.cise.ufl.edu/wp-content/uploads/sites/378/2019/04/TIDRC-Framework-soni-et-al-IDC19-final.pdf
21. Pictorial Assessment of Interests (PDII). https://www.researchgate.net/publication/260441057
22. Picture Interest Career Survey (PICS) administration guide. https://www.disabilitytraining.com/pdf/pics-ag.pdf
23. Khan Academy Kids: supporting English language acquisition (visual interface, sparkles). https://blog.khanacademy.org/supporting-english-language-acquisition-with-khan-academy-kids/
24. Career Interest Inventory Pictorial Version, Shasta. https://ksdetasn.org/resources/3191
25. NN/g, Teenager's UX. https://www.nngroup.com/articles/usability-of-websites-for-teenagers/
26. NN/g, Design for kids based on physical development. https://www.nngroup.com/articles/children-ux-physical-development/
27. Bits Kingdom, UX for Gen Alpha preteens. https://bitskingdom.com/blog/ux-design-gen-alpha-preteens/
28. UXPin, optimal line length. https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/
29. Dyslexia Scotland, accessible formats (1.5 line spacing). https://dyslexiascotland.org.uk/wp-content/uploads/2025/09/formats.pdf
30. Brilliant home screen analysis, screensdesign. https://screensdesign.com/articles/mobile-app-home-screen-design/
31. Headspace information architecture study. https://medium.com/@phaneron/headspace-app-information-architecture-457ef0a3cc16
32. Duolingo, new home screen design (official). https://blog.duolingo.com/new-duolingo-home-screen-design
33. Duolingo path outcomes whitepaper 2024. https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_write_speak_2024.pdf
34. UX Magazine, hot streak design without shame. https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame
35. Yu-kai Chou, streak design. https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/
36. Xello for elementary (K-2 Career Town story, 3-5 flow). https://xello.world/en/why-xello-for-elementary/
37. Prodigy and adaptive RPG mechanics. https://edtechbooks.org/onlinetools/prodigy
38. Children's avatar making in social online games, CHI 2025. https://arxiv.org/pdf/2502.18705
39. EdWeek, what educators need to know about Kahoot. https://www.edweek.org/technology/4-things-educators-need-to-know-about-kahoot/2023/08
40. Life beyond 960px: designing for large screens. https://webdesign.tutsplus.com/life-beyond-960px-designing-for-large-screens--webdesign-7348a
41. Vaadin master-detail layout (split, overlay, stack). https://vaadin.com/docs/latest/components/master-detail-layout
42. Salt design system, responsiveness and density. https://saltdesignsystem.com/salt/foundations/responsiveness
43. NN/g, progressive disclosure. https://www.nngroup.com/articles/progressive-disclosure/
44. Microsoft, progressive disclosure controls (stability). https://learn.microsoft.com/windows/win32/uxguide/ctrl-progressive-disclosure-controls
45. Bento grid practical guide 2026. https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide
46. Appcues, in-app onboarding. https://www.appcues.com/blog/in-app-onboarding
47. Pendo, accelerating the path to aha moments. https://www.pendo.io/resources/accelerating-the-path-to-aha-moments-and-value-with-in-app-onboarding/
48. Skilljar, onboarding best practices. https://skilljar.com/blog/7-user-onboarding-best-practices
49. Learning techniques to improve memory in children: systematic review. https://pure.urosario.edu.co/es/publications/learning-techniques-to-improve-memory-in-children-a-systematic-re/
50. Spaced retrieval in preschoolers, PMC. https://pmc.ncbi.nlm.nih.gov/articles/PMC9529323
51. Spaced practice policy review, Policy Insights 2016. https://journals.sagepub.com/doi/10.1177/2372732215624708
52. The Education Hub, benefits of retrieval practice. https://cdn.theeducationhub.org.nz/wp-content/uploads/2019/08/The-benefits-of-retrieval-practice-in-learning.pdf
53. Sago Mini, letter to parents (open-ended play). https://sagomini.com/article/sago-mini-letter-to-parents/
54. Kidscreen, Sago Sago on developing for preschool. https://kidscreen.com/2015/04/09/sago-sago-dishes-on-developing-for-the-preschool-market
55. Toca Boca and the importance of play. https://readwriterespond.com/2018/02/toca-boca/
56. Attention engineering and micro-details, UMass Boston. https://www.cs.umb.edu/~ronidomi/rpaper.pdf
57. Smashing Magazine, animated microinteractions. https://smashingmagazine.com/2016/08/experience-design-essentials-animated-microinteractions-in-mobile-apps
58. Adobe XD, how micro-interactions enhance UX. https://xd.adobe.com/ideas/principles/human-computer-interaction/how-micro-interactions-can-enhance-the-user-experience
59. Taleemabad project document (engagement testing of episodes). https://cl.globalgiving.org/pfil/48862/projdoc.pdf
60. Taleemabad, MIT Solve. https://solve.mit.edu/solutions/20079
61. Malala Fund on digital education in Pakistan. https://malala.org/news-and-voices/digital-education-is-on-the-rise-in-pakistan-as-covid-19-keeps-students-at-home
62. Conceptual design of mobile learning for preschoolers (parent mode, offline). https://arxiv.org/pdf/1606.05753
63. Parental involvement proof of concept at elementary schools. https://jsr.org/index.php/path/article/view/939
64. Xello K-5 lessons and assignments (help centre). https://help.xello.world/en-CA/Content/Training/Xello-K-5/LW_Delivering-Lessons-Assignments-3-5.htm
65. Indeed Pakistan, software engineer salaries. https://pk.indeed.com/career/software-engineer/salaries
66. Levels.fyi, software engineer Pakistan. https://www.levels.fyi/t/software-engineer/locations/pakistan
67. PakFinanceHub salary checker 2025-26. https://pakfinancehub.com/salary-checker-pakistan/
68. HelloPeBL, average salary in Pakistan (PBS Labour Force Survey). https://hellopebl.com/resources/blog/average-salary-pakistan/
69. Khan Academy, new layout for course and unit pages. https://support.khanacademy.org/hc/en-us/articles/17688542984461
70. Khan Academy, mastery progress visualisation (one square per skill). https://support.khanacademy.org/hc/en-us/community/posts/18735056915469
71. EdTech Innovation Hub, Khan Academy Reimagined learner dashboard. https://www.edtechinnovationhub.com/news/khan-academy-redesigns-classroom-platform-as-ai-tools-move-further-into-daily-teaching
72. Screenwise, gamification and reward systems in learning apps (streak obsession caution). https://screenwiseapp.com/guides/gamification-and-reward-systems-in-learning-apps
73. Raah Offline prototype (uploaded by the product owner), reviewed in browser 5 Nov 2026.
