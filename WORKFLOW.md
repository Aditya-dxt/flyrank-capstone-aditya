# AI-Assisted Workflow Drill — WORKFLOW.md

## Setup
- Feature: Settings form with validation (capstone-relevant, small scope).
- Branch `round-one-vague`: one-sentence prompt "Create a settings form with validation" — no file refs, no constraints, accept output as-is.
- Branch `round-two-precise`: precise prompt with file refs (`src/components/SettingsForm.jsx`, `src/utils/validateSettings.js`), stack constraints (React + Vite + Tailwind + react-hook-form + zod), example behavior, and verification step "write it, then write tests and run them". Plan mode with explore → plan → code loop. Fresh session, fresh branch.

## Correctness
Round one generated an imperative `validateSettings(values)` with two regex constants (`EMAIL_PATTERN`, `URL_PATTERN`) and fields `fullName/email/company/website/timezone/emailNotifications`. No zod, no resolver, no tests. Validation lived inside the component's `handleChange/handleBlur` and missed zod's `min(2)` message specificity (`"Full name must be at least 2 characters"` vs `"Full name is required."` split). Round two extracted a `z.object` in `src/utils/validateSettings.js` exporting `settingsSchema`, `defaultSettings`, and `hasSavedSettings(values)` with exact error strings asserted in 11 tests. The verification loop caught one AI mistake: the first precise draft spread `initialValues` directly into `defaultValues` without merging `defaultSettings`, causing React warnings when `initialValues = { name: "Jane" }` left `email` and `notifications` undefined and flipping controlled → uncontrolled. Fixed by `defaultValues: { ...defaultSettings, ...initialValues }` and added the test "keeps fields controlled with partial initial values".

## Accessibility
Both rounds added `htmlFor`/`id` and `aria-invalid`/`aria-describedby` + `role="alert"` on errors. Only round two added `aria-busy` on the `<form>`, `aria-live="polite"` on the loading state, disabled states for `isLoading || isSubmitting`, and consistent `settings-*` ids (`settings-name`, `settings-email`, `settings-notifications`) with `FieldError` components. Round one's `FormField` missed `aria-describedby` for the checkbox and used generic `fullName-error` ids without guaranteeing uniqueness across forms.

## Edge cases
Round one handled empty strings via `.trim()` but had no `empty-state` or `loading-state` and no `hasSavedSettings` helper, treating `company`/`website`/`timezone` as ad-hoc fields. Round two handles `null` initialValues, partial values via `{ ...defaultSettings, ...initialValues }`, `isLoading` disabling all inputs/button, `isSubmitting` swapping label to "Saving…" and `noValidate` to suppress native messages.

## Review effort & timing
Round one felt faster (prompt 30s, gen ~90s) but needed ~35 min review — imperative validation, manual testing that empty submit blocked, zero tests. Round two took ~8 min to write the precise prompt + plan, ~3 min gen, ~12 min review because `vitest run` (11 tests) surfaced the partial-values bug before manual QA. End-to-end ~23 min vs ~37 min: spec + verification feels slower but is faster overall.

## Rules distilled
See `CLAUDE.md` for testable rules: react-hook-form+zod boundary, validation module contract, a11y/empty-state contract. v0 comparison skipped — reserved for FE-12 preamble reuse.
