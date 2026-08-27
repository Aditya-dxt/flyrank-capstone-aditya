# CLAUDE.md

## Stack
- Frontend: React + Vite
- Styling: Tailwind CSS
- Language: JavaScript
- Forms: react-hook-form + zod via @hookform/resolvers/zod
- Testing: Vitest + @testing-library/react + userEvent + jsdom (globals: true, setupFiles: src/test/setup.js)

## Conventions
- Conventional Commits format (feat, fix, docs, chore)
- Functional components with hooks
- PascalCase for component names

## Project Rules (learned from AI-assisted workflow drill)
1. Forms MUST use react-hook-form + zod (zodResolver) — never useState with manual validateSettings. The schema is the single source of truth; inline regex in components fails review.
2. Validation lives in `src/utils/validateSettings.js` and MUST export `settingsSchema` (z.object), `defaultSettings`, and `hasSavedSettings(values)`. Schemas define exact messages: "Name is required", "Name must be at least 2 characters", "Please enter a valid email address".
3. Controlled inputs MUST merge defaults: `defaultValues: { ...defaultSettings, ...initialValues }`. Tests MUST include the partial-initialValues case (`initialValues={{ name: 'Jane' }}`) to guard against controlled ↔ uncontrolled warnings.
4. Accessibility contract: every input has `htmlFor`/`id` (`settings-name`, `settings-email`, `settings-notifications`), `aria-invalid` tied to `errors[field]`, `aria-describedby` pointing to `${id}-error`, and `FieldError` rendering `role="alert"`. Forms set `aria-busy` during `isLoading || isSubmitting`; loading state uses `data-testid="loading-state"` with `aria-live="polite"`.
5. Empty/loading/submitting states are required: `data-testid="empty-state"` when `!hasSavedSettings(initialValues)` and not loading, disabled inputs + button during `isLoading` or `isSubmitting` with button text swapping "Save settings" ↔ "Saving…", and `noValidate` on the form to suppress native messages. Every new form MUST ship with `src/components/<Form>.test.jsx` covering blur validation, label association, controlled behavior, and submit blocking — `vitest run` must pass before push.
