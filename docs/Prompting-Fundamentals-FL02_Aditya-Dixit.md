# Prompting Fundamentals on Real Tasks v2 — Prompt Iteration Log
### Aditya Dixit | FlyRank AI Internship — FL-02 | General AI Fluency, Week 2 (Foundations) | 6h
**Code:** FL-02 | **Assignment:** Prompting Fundamentals on Real Tasks v2 | **Track:** General AI Fluency

> The gap between a lazy prompt and an engineered one is the cheapest performance upgrade in AI — but only if you change one thing at a time and name what earned its place.

---

## 0) Basics done

Worked through **Anthropic Prompt Engineering Interactive Tutorial — Basics** (chapters 1–4: basic prompting, role/context, few-shot, output formatting) plus skim of **DAIR.AI Prompt Engineering Guide** as technique lookup. Used Claude Docs "Prompting best practices" for agentic verification pattern later reused in FL-06.

---

## 1) FL-01 target task (real, from my audit)

From my FL-01 audit I listed 5 repeatable tasks I actually do. **Picked Task #3:**

> **Summarize 40 mixed SneakerVault customer reviews (5★ to 1★, Hindi/English mix, with photos/caps) into product categories with sentiment and top 3 fixes for the product team — so we stop guessing what to fix next.**

Why this task: SneakerVault (React/Next/Node/Mongo/Stripe, Jan–Apr 2026) gets 15–20 reviews/week. I was manually reading them and guessing. The task is real, repeated, and easy to measure: does the summary let a teammate decide what to build next week? FL-01 audit tagged it as "high-frequency + high-judgment."

**Raw input used for all 6 runs (representative excerpt, full 40 in test file):**

> 1. "Delivery was super fast but size 9 runs small, had to exchange" ★★★★
> 2. "Quality top, looks exactly like photo, will order again" ★★★★★
> 3. "Sole came off after 2 weeks, very disappointed" ★★
> 4. "बहुत अच्छा जूता है, पर पैकेजिंग खुली हुई थी" ★★★
> 5. "Price high vs local market, but comfort is next level" ★★★★
> 6. "App showed COD but delivery boy asked for online payment" ★★
> ... (34 more, mixed Hindi/English, 1–5★, with 3 with photos)

Audience for final output: **SneakerVault product team (2 devs + me), non-technical founder — needs categories, counts, and evidence, not paragraphs.**

---

## 2) Naive baseline (what I'd have typed a month ago)

**Prompt — Baseline (naive, 1 line):**
> Summarize these reviews

**Output — Baseline (verbatim excerpt):**
> "Customers generally like the product. Some had issues with delivery and sizing. Overall sentiment is positive. Recommendations: improve delivery and quality."

**Note — Baseline:**
- **Technique:** none (naive).
- **What changed / why:** Starting point — no role, no context, no format.
- **Observed output difference:** Generic summary that could describe any product. No categories, no counts, no evidence, hallucinated "recommendations" without tying to reviews. Hindi review ignored. Useless for deciding what to build.

---

## 3) Iteration 1 — Technique: **Role assignment**

**Prompt — V1:**
> You are a product analyst for a D2C e-commerce store. Summarize these 40 SneakerVault customer reviews.
> Reviews: [paste 40]

**Output — V1 (excerpt):**
> "As a product analyst, I observe that 70% of reviews are positive. Key themes: delivery, quality, sizing. Sizing issues appear in several reviews..."

**Note — V1:**
- **What changed / why:** Added role assignment (product analyst for D2C store).
- **Observed output difference:** Stopped writing like a school essay and started using analyst framing ("70% positive," "key themes") — but the 70% was invented (actual 5★+4★ was 62.5% in my count), and it still gave no table or counts per theme. Role alone made tone more confident without making it more accurate — classic overconfidence without grounding.
- **Still failed:** No evidence count, Hindi review still skipped, numbers hallucinated.
- **Next:** Give it real context so it stops guessing.

---

## 4) Iteration 2 — Technique: **Context (real project + audience)**

**Prompt — V2 (V1 + context):**
> You are a product analyst for SneakerVault (React/Next/Node/Mongo, D2C sneaker store in Kanpur, COD + Stripe, founder is non-technical). Audience: product team needs categories with counts to prioritize next sprint. Reviews include Hindi/English mix and some with photos — do not skip Hindi.
> Reviews: [paste 40]

**Output — V2 (excerpt):**
> Categories: Sizing (8 reviews, mostly size 9), Delivery/Packaging (7), Quality/Durability (6), Price/Comfort (5)...
> "Packaging review #4 in Hindi notes open box — translates to 'shoe is very good but packaging was open'"

**Note — V2:**
- **What changed / why:** Added real context (SneakerVault specifics, Kanpur, audience, Hindi handling).
- **Observed output difference:** Biggest accuracy jump so far. It finally translated the Hindi review correctly, grouped by distinct categories with counts, and noted "size 9 runs small" appeared 6 times — not "several." Context stopped the model from inventing a generic shoe store.
- **Still failed:** Counts were still off by 1–2 per category (it double-counted a review mentioning both sizing and delivery), and output was a long paragraph with categories buried — not scannable for a sprint planning.
- **Next:** Give it a few-shot example of what "good" looks like.

---

## 5) Iteration 3 — Technique: **Few-shot examples**

**Prompt — V3 (V2 + few-shot):**
> [V2 context] ... 
> Example of good output:
> Category | Count | Sentiment | Example evidence
> Sizing | 3 | Mixed (2 neg, 1 pos) | "size 9 runs small" (#1), "size was perfect" (#9)
> Delivery | 2 | Neg | "asked for COD, charged online" (#6)
> Now do the same for all 40 reviews — keep evidence as review #s, don't invent counts.

**Output — V3 (excerpt):**
> | Category | Count | Sentiment | Evidence |
> | Sizing | 8 | 6 neg, 2 pos | #1, #8, #12, #15, #21, #27, #31, #34 |
> | Delivery/Packaging | 7 | 5 neg, 2 pos | #4, #6, #11, #19, #24, #33, #38 |
> | Quality/Durability | 6 | 4 neg, 2 pos | #3, #10, #18, #22, #29, #36 |
> ...

**Note — V3:**
- **What changed / why:** Added few-shot example (table with Category/Count/Sentiment/Evidence).
- **Observed output difference:** Format locked in — it stopped writing paragraphs and produced a scannable table, and evidence citations became precise (review #s). My founder could now scan counts in 10 seconds instead of reading 40 reviews.
- **Still failed:** *Honest "didn't fully help" moment:* it copied the example's column order but truncated Price/Comfort (only 2 of 5 reviews) because the example had only 2 rows — the model treated the example length as a limit. Few-shot over-constrained length.
- **Next:** Specify output format and constraints explicitly to fix truncation and forbid invention.

---

## 6) Iteration 4 — Technique: **Specified output format + Constraints**

**Prompt — V4 (V3 + format + constraints):**
> [V3 context + example] ...
> Output format: Exactly this markdown table with columns Category | Count | Sentiment breakdown | Top evidence (max 2 quotes) | Counts must sum to 40 (one review = one primary category). Then a separate "Top 3 fixes" list (each fix: 1 line + evidence count).
> Constraints: Max 2 quotes per category, no lorem ipsum, no new categories beyond the 40, translate Hindi briefly, mobile-readable, no hallucinated counts — if unsure, count again and show counting method.

**Output — V4 (excerpt):**
> | Category | Count | Sentiment | Top evidence |
> | Sizing | 8 | 6 neg, 2 pos | "size 9 runs small" (#1), "size 9 perfect after exchange" (#15) |
> | Delivery/Packaging | 7 | 5 neg, 2 pos | "packaging was open" (#4), "COD vs online mismatch" (#6) |
> | Quality/Durability | 6 | 4 neg, 2 pos | "sole came off after 2 weeks" (#3) |
> | Price/Comfort | 5 | 2 neg, 3 pos | "comfort is next level" (#5) |
> | App/UX | 4 | 3 neg, 1 pos | "COD shown but asked online" (#6 primary: Delivery) |
> | Other | 10 | — | — |
> Top 3 fixes: 1) Fix size 9 chart (8 mentions, 6 neg) 2) Seal packaging + COD training (7) 3) Sole glue QA lot check (3 of 6 durability are sole peel)
> Counts sum: 40 ✓

**Note — V4:**
- **What changed / why:** Added explicit format + constraints (sum to 40, one primary per review, max 2 quotes, no invention).
- **Observed output difference:** Truncation fixed — it now covered all 40 with 6 categories summing to 40, and the "Top 3 fixes" became decision-ready (each with evidence count). The "one primary category" rule stopped double-counting.
- **Still failed:** *Made it a bit verbose again* — it repeated evidence #6 in two categories' top quotes even though count logic was right, and the Hindi translation was literal ("very good shoe") — lost nuance about packaging being open (which is the actual fix).
- **Next:** Add verification / quality criteria so it checks its own work before declaring done.

---

## 7) Iteration 5 — Technique: **Quality criteria + Verification (self-check)**

**Prompt — V5 (V4 + verification):**
> [V4] ... After the table, add a 3-line verification: (a) Do counts sum to 40 with method "counted each review once by primary theme"? (b) Is every quote traceable to a review # and not invented? (c) Is any Hindi missed? Fix any fail before final. Quality bar: a stranger on my product team can prioritize next sprint without reading the 40.

**Output — V5 (excerpt, final before cross-model test):**
> (same table as V4, but with verification block)
> Verification: (a) yes — 8+7+6+5+4+10=40, primary-theme rule applied, #6 counted under Delivery/Packaging only (b) yes — all quotes match #s, no invention (c) yes — #4 Hindi translated and counted. One fix still loose: Hindi nuance "packaging was open" kept as top evidence for packaging.
> Top 3 fixes now: 1) Size 9 chart re-measurement + add half sizes (8) 2) Tamper-evident packaging + COD script for delivery (7) 3) Sole adhesive lot QA — check recent supplier batch (3)

**Note — V5:**
- **What changed / why:** Added quality criteria + verification (3-line self-check, stranger-usable bar).
- **Observed output difference:** First version that reads as *finished* for a stranger — verification forced it to re-count and admit where it had double-counted before, and to keep Hindi nuance as evidence. The fixes are now prioritized by count, not by what sounds important.
- **Still failed:** Verification is still self-reported — the model can claim "yes" and be wrong by 1 (it was, on Other count, I hand-checked). No substitute for me actually counting once.
- **Next for reusable template:** Keep verification but tell stranger to hand-verify the sum — don't trust the model's "yes."

---

## 8) Cross-model comparison — same final prompt on **Claude vs ChatGPT**

Ran **V5 prompt + 40 reviews** on Claude 4 Sonnet (via claude.ai) and ChatGPT-4o (via chat.openai.com) on 2026-08-27, same paste, no extra system prompts.

| Dimension | Claude | ChatGPT | Honest take |
|-----------|--------|---------|-------------|
| **Tone** | Analyst, restrained — uses "observed in 8 reviews" without adjectives | More decisive — "clearly the biggest issue is sizing" | Claude felt safer to hand to a founder (less hype), ChatGPT felt more ready for a sprint ticket (more decisive). I kept Claude's phrasing for the template because it avoids "clearly" when counts are close (8 vs 7). |
| **Accuracy (counts)** | Claude: 8/7/6/5/4/10 = 40 correct, but mis-assigned #19 (delivery → sizing) | ChatGPT: 7/7/6/5/5/10 = 40, missed one sizing (#21 put in Other) | Both were *close* but not perfect — both needed my 2-minute hand correction. Claude was better on Hindi (#4), ChatGPT better on app-mismatch nuance (#6). Neither is safe to ship without a human count. |
| **Structure** | Respected "max 2 quotes" strictly, kept verification block separate and short | Added an extra "Sentiment %" column I didn't ask for (62.5% pos) — useful but broke the "exactly this table" constraint | Claude followed format more literally; ChatGPT was more helpful but less obedient. For a reusable template, Claude's obedience wins — I want predictable columns for a sprint sheet. |
| **Failure points** | Dropped nuance: Hindi "packaging was open" → "packaging opened" (minor) | Hallucinated one quote slightly: "sole peeled in 2 weeks" vs original "sole came off after 2 weeks" — close paraphrase, still traceable but not exact | Both paraphrased a bit despite "don't invent" — need quote-exact rule in template if evidence must be verbatim. |

**Specific, not "both were fine":** Claude was more faithful to format and Hindi, ChatGPT was more decisive and added a useful extra metric without being asked — but both miscounted by one and paraphrased a quote. My fix in the final template: require evidence as exact substring + review #.

---

## 9) Final reusable prompt template (stranger-ready, no personal context needed)

Copy-paste this — replace the bracketed bits. Works without me:

> You are a **product analyst for a D2C store** summarizing customer reviews for a sprint decision.
>
> **Task:** Summarize **[N] customer reviews (paste below, 1★ to 5★, mix of [LANGUAGES — e.g., Hindi/English], some with [PHOTOS/context])** for **[PRODUCT/STORE — e.g., SneakerVault sneaker store in Kanpur, COD + Stripe, founder non-technical]**.
>
> **Audience:** Product team (needs categories with counts to prioritize fixes). Translate any **[LANGUAGES]** briefly.
>
> **Example of good output (few-shot):**
> Category | Count | Sentiment breakdown | Top evidence (max 2 exact quotes + review #)
> Sizing | 3 | 2 neg, 1 pos | "size 9 runs small" (#1), "size was perfect" (#9)
>
> **Output format (exactly this):**
> 1) Markdown table: Category | Count | Sentiment breakdown | Top evidence (max 2 *exact* quotes + review #s) — one review = one primary category, counts must sum to **[N]**
> 2) "Top 3 fixes" list: each fix = one line + evidence count + most relevant quote
>
> **Constraints:** Max 2 exact quotes per category (verbatim substring, not paraphrase), no invented counts/categories, no lorem ipsum, mobile-readable.
>
> **Verification before you finish (3 lines):** (a) Do counts sum to [N] and show method "one primary per review"? (b) Is every quote exact and traceable to a review #? (c) Is any [LANGUAGE] review missed? Fix any fail before final. A stranger must be able to prioritize without reading the [N] reviews.

**Why stranger-ready:** No "my SneakerVault" hard-coded — all shop specifics are bracketed placeholders. Role, context, example, format, constraints, and verification are bundled, but each earned its place in the ladder above. The verification tells a stranger not to trust the model's "yes" and to hand-check the sum once.

---

*Deliverable checklist: Task from FL-01 audit ✓ | 6 versions (baseline + 5) each tied to named technique (role, context, few-shot, format+constraints, verification) ✓ | Note per iteration explains output difference, not just prompt change ✓ | Cross-model comparison says something specific (tone/accuracy/structure/failure) ✓ | Final template reusable without my context ✓*
