# Version one of queryn isn’t flashy — and that was the whole point

I’m hitting publish silly late tonight because I spent most of my evening golfing. On another week that might’ve felt like I’d robbed the sprint — stolen hours from Something Important. Tonight it mostly felt like the experiment working: **if you carve out even something like thirty extra focused minutes most days**, and you refuse to let “agentic coding” excuse sloppy hygiene, **can you still land Week One with a real app** — auth included, infra included, embarrassment level low?

queryn isn’t architecture cosplay. It’s a small quiz surface: **Google sign-in through Firebase**, **Firestore** for saved sessions, **Cloud Functions** sitting in front of Anthropic so keys never live in the browser, **React + Vite + MUI** for the UI, and **enough automated proof** that I don’t pretend routes and APIs behave because I prayed at them once.

The question I cared about answering was smaller than disruption and bigger than vibes:

> Can you ship something **legitimate** without a death march — and **without blaming the LLM when the merges were yours to approve**?

Below is Week One distilled: what we chased on purpose, what actually shipped, what I’d wave a flag at versus what I’d quietly fix later, plus what today looked like when the golfing stopped and `**firebase deploy`** said yes anyway.

---

## What we deliberately optimized for

Three bets, spelled out upfront:

1. **The next reader isn’t doomed** — README that matches what the app does, Cloud Logging fields you can filter on, structure described by *responsibility* instead of a file tree that rots the week after you write it.
2. **The work leaves footprints** — issues with acceptance criteria, small PRs, commits that point back to *why* something changed.
3. **Failure has a shape** — rate limits on the AI endpoints, structured logs that never echo raw user topics, a thin Playwright smoke so “signed-in user hits the topic grid and loads a quiz” isn’t a prayer.

Conspicuously *not* on that list: clever layers nobody asked for, microservices fan fiction, or a binder of ADRs that goes stale before anyone opens it.

Agentic tooling, for me here, wasn’t a license to stop thinking — it was **throttle**: easier to sketch tests, easier to tighten copy, easier to chase edge cases — **but only because “merge junk” stayed off limits.**

---

## The arc — wins first

What I’d stand behind in a retrospective without wincing:

- **Auth that tells the truth** — Google-only; no sham “sign up vs sign in” buttons that fire the identical OAuth dance. First visit creates the Firebase user; later visits are the same flow, honestly described.  
- **Secrets and validation live server-side** — topic validation, rate limits, Anthropic behind HTTPS functions, logging with `queryn_*` fields so incident response doesn’t start with “grep the entire log blob.”  
- **Tests where they earn their keep** — Vitest on React and on `functions/` logic; Playwright smoke with an explicit **E2E stub auth** and mocked function traffic so CI isn’t a subscription bill.  
- **Housekeeping in public** — issues for structured logging, README accuracy, reduced motion — the boring delta between “demo” and “someone else could inherit this.”

The honest scrapes (I’m glad they’re visible, not hidden):

- **Runtime maintenance is on the radar** — Cloud Functions still on a Node generation the platform is already waving goodbye at; dependency upgrades in `functions/` aren’t hypothetical forever.  
- **E2E setup bit us once before it behaved** — real machines, real PATH quirks; we fixed npm scripts instead of pretending every contributor’s laptop is idyllic.  
- **The topic mix is eccentric on purpose until it isn’t** — core CS plus calculus-adjacent cards is a content decision that will deserve another pass once “does the thing work?” stops being the headline risk.

None of that invalidates Week One — it **is** Week One.

---

## What today added (spoiler: not glamour)

Earlier today `**main`** already carried the `**prefers-reduced-motion**` work — card hover motion dialed down when the OS asks for reduced motion, a couple Vitest checks on theme overrides, a short README note on how to eyeball it. From there we **shipped**: full `**firebase deploy`** — Hosting, Functions, Firestore rules and indexes — and watched the gates go green. The prod URL stayed the familiar `**queryn-dfe1d.web.app**`, except now it quietly included the accessibility polish alongside everything else already merged.

Separate from commits, there was the small UX reality check around **Google-only auth**: **no separate “create account” path** unless you genuinely add another provider — first Google sign-in *is* account creation. The product copy should say that plainly; the interface shouldn’t duplicate buttons to perform the same OAuth hop.

So **today** was less about lines of code and more about **closing the loop** — accessibility on prod, deploy verified, mental model of auth aligned with what Firebase actually does. The kind of afternoon that won’t trend on X but **does** show up when you open the app on your phone walking off the 18th.

---

## Golf, clocks, and working *with* the agent

The take I’m not walking back:

Good engineering in 2026 **doesn’t mean cosplaying that LLMs don’t exist**. It means you still own **risk, review, naming, outages, and the apology when you guessed wrong**. Models compress typing and exploration; **they don’t compress judgment** unless you volunteer to outsource it.

What they *can* return — when you hold the line on process — is **slack**: issues that don’t stall, READMEs that don’t lie, commits a teammate can skim without guesswork, guards on the endpoints that already burned you once in staging. Enough slack, on a night like this, for **nine holes and a short game that definitely needs work**.

That’s not decadence. That’s the promise automation keeps almost delivering — except this time the scaffolding (tests, issues, deploy, logs) is the part that has to stay human-serious so the rest can breathe.

Week One ends with queryn **intentionally boring**: not a pitch deck in search of a product — a **baseline** you can debug, extend, or hand off.

**Baseline met for v1:** auth works, infra is coherent, telemetry exists, a robot can walk a happy path, documentation and git history tell a story you don’t have to whisper.

And yes — I traded polishing this essay for chasing a bad read on a par five. Sometimes that’s the whole point of the sprint.

---

## Next week — I want to hear from you

**queryn stays live** — poke it anytime: [queryn-dfe1d.web.app](https://queryn-dfe1d.web.app) · **repo:** [github.com/alexandrakay/queryn](https://github.com/alexandrakay/queryn)

Each week of this sprint is deliberately **a new app from the bottom up** — fresh repo, fresh problem, same discipline (auth where it fits, docs, tests, deploy path, no “vibe-only” merges). **I’m not continuing queryn next week**; it already did its job as Week One’s artifact.

**Do you have any ideas or requests for next week’s app?** I’m bootstrapping something else from zero with the same “~thirty minutes a day + real hygiene” rule — comment, DM, email, whatever you use. I’d genuinely like prompts: a pain to solve, a stack you’re curious about, a tiny product you wish existed.

**queryn v2** isn’t on my calendar unless people clearly want more of this specific thing. If demand ever justified a sequel, these are the kinds of upgrades that would make the cut — not commitments, just a scribbled backlog:

- **Session history that feels intentional** — filter or search by topic, sort by date, a humane empty state for new users — work that respects people who come back, not only first‑time quiz completions.  
- **CI as a habit** — GitHub Actions running `**npm test`** and `**npm run test:e2e**` so “works on my machine” isn’t the release bar.  
- **Functions housekeeping** — Node/runtime uplift and a deliberate `firebase-functions` upgrade before deprecation bites.  
- **Topic taxonomy pass** — either own “CS plus math adjunct” loudly in the product, or split tracks so labels match how people describe what they’re studying.  
- **Landing copy that explains Google-first auth in one honest sentence** — no duplicate “sign up vs sign in” theater.

Week One proved the floor: **boring, documented, test-backed, deployable** — and still room for golf if you protect the process. See you next build.