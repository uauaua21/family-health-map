# Architecture

## Runtime

The app uses React, TypeScript, Tailwind CSS, and React Flow. The same App Router source supports standard Next.js and an alternative Vinext/Cloudflare Worker build. The repository's Vercel config selects `build:vercel`. No hosting account or deployment is created by building it.

The main dashboard is served at `/` and `/dashboard`. Each page instance maintains its own temporary React state. The `/doctor` route renders a fixed fictional demo summary; it is not a saved view of the current dashboard record.

## Data flow

1. `lib/demo-data.ts` initializes a fictional family in browser memory.
2. Forms update the current in-memory family.
3. The dashboard posts the family and locale to `/api/analyze`.
4. Zod checks field types, limits, and unique family-member IDs.
5. `lib/rules.ts` evaluates only blood-relative records. Repeated condition records for one member count once; the earliest reported age is retained for the configured age rule.
6. `lib/narratives.ts` formats the detected patterns into an explanation and summary.
7. The browser displays pattern cards and a summary dialog. If the API is unavailable, the same local rules and narratives run in the browser.

Rules are deterministic. They do not use a statistical risk model, genetic testing, or an LLM to choose patterns. Case/whitespace normalization is not medical synonym resolution. The default fictional family produces four signals: repeated and multi-generation patterns for Heart Disease and Type 2 Diabetes.

## Visualization

React Flow places records by generation and family side. The schema has no explicit parent-child IDs, so lines are illustrative. Do not treat the display as a verified pedigree or use it to calculate inheritance.

## Optional AI

`lib/ai.ts` is server-side code. It requires both explicit `ENABLE_AI_EXPLANATIONS=true` and a configured key before making an external request. It returns the local narratives when disabled, when there are no patterns, or when the request/response fails. The prompt restricts the task to explaining existing patterns. Prompt instructions do not guarantee medically safe output; human review remains necessary. This preparation tested the disabled path only and made no live OpenAI calls.

The optional request omits names, record IDs, and notes from its reduced family payload. Reported conditions and relationships are still sensitive information. Do not enable it for real records without a separate privacy assessment.

## Storage scaffold

The SQL file defines families, family_members, and medical_conditions with row-level security enabled. It has no ownership/authentication policies. The service-role helper bypasses normal client policies and is not used by any route. Neither the app nor the API saves records to Supabase. No database connection is needed for the demo.

## Build targets

| Command | Target |
| --- | --- |
| `npm run dev:next` | Standard Next.js local development |
| `npm run build:vercel` | Next.js production output in `.next/` |
| `npm run start:next` | Serve the existing Next.js production build |
| `npm run dev` | Alternative Vinext development server |
| `npm run build` | Vinext/Cloudflare build in `dist/` |
| `npm start` | Run that Worker output locally through Wrangler |

The copied private hosting linkage and platform plugin were removed from the public source copy. Vite now has a portable local Worker configuration. Existing deployments and original project files were not modified. Vinext is a separate implementation of Next.js APIs; validate application compatibility when updating it. See [the upstream project](https://github.com/cloudflare/vinext).

## Before production use

Add authentication, authorization, persistent storage, a data-retention policy, input/body limits, request abuse protection, auditing, and an appropriate healthcare/privacy review. Clinical validation is a separate requirement; a passing software test suite is not clinical validation.
