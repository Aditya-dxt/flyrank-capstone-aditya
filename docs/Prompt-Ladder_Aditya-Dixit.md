# The Prompt Ladder
### Aditya Dixit | FlyRank AI Internship — General AI Fluency, Week 2 (Foundations) | Track: Frontend AI Engineering
**Assignment:** CUSTOM-MRBSNHWC-B3701520 | Workload: 2h | Phase: Foundations

> The cheapest performance upgrade in AI is not a new model — it's changing one thing at a time and comparing outputs. This ladder does exactly that.

---

## Baseline (the embarrassing prompt I would have typed a month ago)

**Prompt — Baseline (0):**
> Build a website

That's it. No goal, no audience, no context, no format, no constraints. The kind of prompt that feels fast and teaches nothing.

**Output — Baseline (excerpt, as returned):**
> ```html
> <html><head><title>My Website</title></head><body>
> <h1>Welcome to My Website</h1>
> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
> <button>Click Here</button>
> </body></html>
> ```
> Generic HTML, lorem ipsum, "Click Here" CTA, no Tailwind, no React, no real business. It could be a dentist, a DJ, or a dog food store. Zero signal about what the site should *do*.

---

## Version 1 — Layer added: **clearer goal**

**Prompt — V1:**
> Build a single-page marketing website that gets visitors to book a coffee tasting. Keep the page focused on one action.

**What changed in prompt:** Added one layer — a clearer goal (book a tasting, not "build a website").

**Output — V1 (excerpt):**
> Hero: "Experience Coffee Differently" + CTA "Book Your Tasting"
> Sections: Hero → About → Menu → Contact (generic filler copy)
> Still HTML boilerplate with placeholder text: "Our coffee is the best in town..."

**Four notes — V1:**
- **What changed in prompt:** Added clearer goal (one action: book tasting).
- **What actually improved in the output:** It stopped generating a random multi-purpose site and finally anchored on a single CTA — the hero now has "Book Your Tasting" instead of "Click Here," so a visitor knows what to do.
- **What still failed:** Copy is still generic ("best in town"), no audience, no real shop details, layout is a stock 4-section template that could be any café.
- **What I'd try next:** Define *who* I'm talking to — busy professionals vs students changes everything about tone and what to emphasize.

---

## Version 2 — Layer added: **defined audience**

**Prompt — V2:**
> Build a single-page marketing website that gets busy professionals in Kanpur who know coffee but are new to specialty roasters to book a coffee tasting.

**What changed in prompt:** Added one layer — defined audience (Kanpur professionals, coffee-aware but specialty-new).

**Output — V2 (excerpt):**
> Hero: "For Professionals Who Take Coffee Seriously"
> Copy: "Elevate your mornings with our premium single-origin blends, curated for the discerning connoisseur..."
> Tone shifted to corporate: "Optimize your productivity with artisanal excellence"

**Four notes — V2:**
- **What changed in prompt:** Added defined audience.
- **What actually improved in the output:** *This one didn't help — it made it worse.* The output started using jargon my audience wouldn't say ("discerning connoisseur," "optimize productivity") and assumed a stiff corporate reader. It sounded less like a neighbourhood roaster and more like a LinkedIn ad. The lesson: audience without real context just invites stereotypes.
- **What still failed:** Still no real shop, no menu, no location, no palette — so the model filled the gap with buzzwords.
- **What I'd try next:** Give it real context — my actual shop, my actual product — so it stops inventing a fake audience persona.

---

## Version 3 — Layer added: **real context**

**Prompt — V3:**
> Build a single-page marketing website that gets busy professionals in Kanpur who know coffee but are new to specialty roasters to book a coffee tasting.
> Context: This is for Brew & Co — my specialty coffee roaster template (React + Vite + Tailwind + Framer Motion, live at brew-and-co-opal.vercel.app). Light-roast focus, direct-trade story, warm minimal palette (#0f172a / #f8fafc / amber accents), existing sections: hero, story, roast lineup, tasting booking. Use real Kanpur details, not lorem ipsum.

**What changed in prompt:** Added one layer — real context (actual project, stack, palette, story, live URL).

**Output — V3 (excerpt):**
> Hero: "Light Roast, Direct Trade — Tasted in Kanpur"
> Story: "We source from Chikmagalur estate, roast light to keep floral notes..."
> Roast Lineup: "Ethiopia Guji (jasmine), Chikmagalur Honey (stone fruit)" with tasting notes
> CTA: "Book a 20-min tasting — pick your slot, taste two pours side by side"

**Four notes — V3:**
- **What changed in prompt:** Added real context (Brew & Co's actual roasts, story, stack, palette).
- **What actually improved in the output:** It stopped inventing fake coffee and finally sounded like *my* shop — real origins, real tasting notes, real Kanpur anchor. A stranger can now tell this isn't a template; it's a specific roaster with a point of view. Biggest jump so far.
- **What still failed:** Output came back as one giant markdown dump with mixed HTML/Tailwind snippets and no file structure — I couldn't copy-paste it into my Vite project without hunting through prose.
- **What I'd try next:** Specify the output format so the code is actually usable.

---

## Version 4 — Layer added: **specified output format**

**Prompt — V4:**
> Build a single-page marketing website that gets busy professionals in Kanpur who know coffee but are new to specialty roasters to book a coffee tasting.
> Context: Brew & Co — React + Vite + Tailwind + Framer Motion, light-roast direct-trade, palette #0f172a/#f8fafc/amber, sections hero/story/lineup/booking, live at brew-and-co-opal.vercel.app.
> Output format: 1) File map (App.jsx, components/Hero.jsx etc.), 2) Full code for Hero + Booking section only (React + Tailwind, no lorem ipsum, copy in my voice: direct, warm, plain, specific), 3) Brief notes on where placeholder images go. No extra prose.

**What changed in prompt:** Added one layer — specified output format (file map + scoped code blocks + voice).

**Output — V4 (excerpt):**
> File Map:
> - src/App.jsx
> - src/components/Hero.jsx
> - src/components/Booking.jsx
> ```jsx
> // Hero.jsx
> <section className="min-h-[70vh] bg-slate-900 text-slate-50 ...">
> <h1 className="text-4xl font-semibold">Taste light roast, properly — in Kanpur</h1>
> <p>Two pours, one story. Direct trade from Chikmagalur, roasted light.</p>
> <button>Book a 20-min tasting</button>
> ```
> (followed by 80 more lines of Booking form code)

**Four notes — V4:**
- **What changed in prompt:** Added specified output format.
- **What actually improved in the output:** It became copy-paste usable — I got a file map and real React/Tailwind code for Hero + Booking instead of a wall of prose. I could drop it into `src/` immediately.
- **What still failed:** *Honest "made it a bit worse" moment:* it became *too* verbose — it generated full props, Framer variants, and 3 example bookings even though I asked for 2 sections, and the copy repeated "Kanpur" 6 times because the format didn't constrain length. Useful but not tight.
- **What I'd try next:** Add constraints so it stays runnable and tight.

---

## Version 5 — Layer added: **constraints**

**Prompt — V5:**
> Build a single-page marketing website that gets busy professionals in Kanpur who know coffee but are new to specialty roasters to book a coffee tasting.
> Context: Brew & Co — React + Vite + Tailwind + Framer Motion, light-roast direct-trade, palette #0f172a/#f8fafc/amber, sections hero/story/lineup/booking.
> Output format: File map + full React + Tailwind code for Hero + Booking only, copy in voice: direct, warm, plain, specific, no buzzwords.
> Constraints: mobile-first, Tailwind only (no extra deps beyond React/Framer), accessible (labels, aria, keyboard), max 18 words per headline, no lorem ipsum, must be copy-paste runnable. Before final, self-check: does npm run build pass? Is the booking button reachable by keyboard? Fix if not.

**What changed in prompt:** Added one layer — constraints (mobile-first, stack-locked, a11y, length, runnable check).

**Output — V5 (excerpt):**
> ```jsx
> // Hero.jsx — 22 lines, mobile-first
> <section aria-labelledby="hero-title" className="px-4 py-16 sm:py-20">
> <h1 id="hero-title" className="text-3xl sm:text-4xl">Light roast, direct trade — taste it here</h1>
> <p className="mt-3 max-w-prose text-slate-600">20 minutes, two pours. Same bean, two roasts — you pick what you like.</p>
> <button className="mt-6 rounded-lg bg-amber-600 px-5 py-3">Book a tasting — 20 min</button>
> </section>
> // Booking.jsx — labels, aria-describedby, keyboard focus ring, no extra deps
> ```
> Self-check note: "Build passes, button has focus ring, headline 7 words, no lorem ipsum."

**Four notes — V5:**
- **What changed in prompt:** Added constraints (mobile-first, stack, a11y, length, self-check).
- **What actually improved in the output:** It got tight and shippable — headline dropped from 12 words to 7, mobile padding fixed, button got a focus ring, and it stopped adding random dependencies. The self-check actually caught a missing `htmlFor` and fixed it before I had to.
- **What still failed:** Self-check is honest but still self-reported — the model can claim "build passes" without running it. I still need a real verification step when I paste it.
- **What I'd try next for a stranger:** Bundle the best layers, add a verification requirement ("paste, run build, list 3 checks you passed"), and clean placeholders so someone else can run it without me.

---

## Side-by-side comparison (don't trust memory)

| Version | Layer added | What the output *felt* like |
|---------|-------------|------------------------------|
| Baseline | — | Generic dentist-site HTML |
| V1 | clearer goal | Finally a CTA, still lorem ipsum |
| V2 | audience (alone) | Worse — corporate jargon, fake persona |
| V3 | real context | Huge leap — real beans, real story |
| V4 | format | Usable code, but verbose/repetitive |
| V5 | constraints | Tight, accessible, runnable |

---

## Final reusable prompt (works for a stranger on Frontend AI Engineering)

Paste this as-is — swap the bracketed bits. No bundling confusion, no "you need to know my project" gap.

> You are building a single-page marketing site in **React + Vite + Tailwind + Framer Motion** (no other deps) that gets **[AUDIENCE — e.g., busy professionals in Kanpur who know coffee but are new to specialty]** to take **[ONE GOAL — e.g., book a 20-min coffee tasting]**.
>
> **Real context (replace with yours):** Project = **[PROJECT NAME + one-line story — e.g., Brew & Co, light-roast direct-trade roaster, Chikmagalur beans, warm minimal palette #0f172a/#f8fafc/amber]**. Existing stack/live URL: **[e.g., brew-and-co-opal.vercel.app]**. Sections already assumed: hero, story, lineup, booking.
>
> **Output format (exactly this):**
> 1) File map (e.g., App.jsx, components/Hero.jsx, components/Booking.jsx)
> 2) Full code for **Hero + Booking only** (React + Tailwind, mobile-first, copy-paste runnable)
> 3) One-line note per placeholder image
>
> **Constraints:** Mobile-first, Tailwind only, accessible (labels + htmlFor/id, aria-invalid/describedby where needed, keyboard focus visible), max 18 words per headline, no lorem ipsum, copy in voice: **direct, warm, plain, specific, no buzzwords**.
>
> **Verification before you finish:** After the code, add a 3-line self-check: (a) would `npm run build` pass? (b) is the primary CTA reachable by keyboard with visible focus? (c) is every headline ≤18 words? Fix any fail before final.

**Why this works for a stranger:** It names the audience and goal up front, forces real context (so no invented beans), locks format (so code is paste-ready), constrains stack/a11y/length (so output stays tight), and requires verification (so the model can't just claim "done").

---

*Deliverable checklist: 6 runs (baseline + 5) ✓ | Each version = exactly one named layer ✓ | Notes describe output changes, not just prompt changes ✓ | At least one honest "didn't help / made it worse" (V2 audience alone, V4 verbosity) ✓ | Final prompt works without me ✓*
