# Repository preparation review

Review date: 28 October 2026.

## What this project contains

Family Health Map is a bilingual React/TypeScript demo for organizing fictional reported family health history. It includes a dashboard, temporary intake forms, React Flow visualization, fixed-rule analysis, local narratives, a summary dialog, and a separate static doctor demo page. It supports standard Next.js and an alternative Vinext/Cloudflare Worker build.

The original optional OpenAI explanation code and Supabase scaffold are present. AI is explicitly disabled by default in this release. Supabase is not connected to the UI or analysis endpoint. No external service is required for the demo.

## Fixes made

| Finding | Change |
| --- | --- |
| Duplicate condition rows could make one relative count as several | Deduplicated rule counts by member identity; retained the earliest reported diagnosis age |
| Duplicate member identities accepted by the API | Added unique-ID validation and defensive rule handling |
| Non-blood relatives could appear in summaries of blood-relative patterns | Filtered local summary input to blood relatives |
| UI described an unauthenticated workspace as protected | Changed that label to fictional demo workspace in both languages |
| Tree lines could be mistaken for verified genealogy | Added an illustrative-connection explanation |
| A configured API key alone enabled optional AI | Added an explicit enable flag, off by default |
| Private platform linkage in the build config | Removed hosting metadata and the platform-specific plugin from the public copy; made Worker config portable |
| Unused starter components and packages | Removed 48 unused UI components and unused dependencies |
| CLI package was needed only for a few CSS utilities | Preserved the small attributed CSS subset and MIT notice, removing the unused CLI dependency |
| Older dependencies had published security advisories | Updated compatible packages and test tooling; added targeted patched dependency overrides |
| Setup and project limits were unclear | Added README, API guide, architecture, security, contribution, third-party notices, and upload instructions |

The original Desktop project was not edited. Its real environment file, Git history, generated builds, dependency folders, local logs, and hosting identifiers are excluded from the upload package.

## Validation

- `npm ci`: passed using the prepared lock file.
- `npm run typecheck`: passed.
- `npm test`: 17 tests passed, including duplicate-count regressions, duplicate-ID validation, threshold boundary behavior, English/Arabic local analysis, invalid input, disabled AI, and summary filtering.
- `npm run lint`: passed.
- `npm run build:vercel`: passed using Next.js 16.4.3.
- `npm run build`: passed using Vinext 1.3.1. It emits upstream bundler warnings about dynamic imports/source maps and reports route classification as unknown. These are recorded rather than presented as a warning-free build.
- Worker runtime: `/`, `/dashboard`, and `/doctor` returned HTTP 200. The real HTTP analysis endpoint returned four expected patterns and an Arabic local explanation with AI disabled.
- Browser: verified English analysis, Arabic translation/RTL, temporary patient creation, demo reset, and responsive rendering. The screenshots show fictional data in the mobile-width preview available during testing.
- `npm audit`: no known vulnerabilities reported in the final resolved dependency graph on the review date. This is not a complete security review.
- No original credentials were reused or included. No live OpenAI request was made.

Local verification used Node.js 24.15.0 and npm 11.12.1 on macOS. GitHub's hosted CI result can only be checked after upload. No public deployment was created.

## Dependency decisions

The primary framework and React packages were updated to patched releases. Test tooling was upgraded to Vitest 5. The Worker toolchain keeps a single patched Wrangler version. Overrides select patched Undici 7.30.1-compatible resolution and fflate 0.8.3 to avoid vulnerable transitive versions pulled by the alternative build and image-rendering toolchain. Both builds and the Worker smoke test passed with these overrides.

The public copy keeps the existing two build targets. The primary documented demo command uses standard Next.js. Framework updates should be checked against both targets.

## Limits that remain

There is no login, persistent patient database integration, user-level access control, clinical evaluation, production abuse protection, or regulated deployment assessment. AI-enabled output was not tested. Arbitrary condition names are matched by case/whitespace normalization only; Arabic condition input and medical synonyms are not normalized to English diagnoses.

The family graph has no explicit parent-child schema. Lines are illustrative. The `/doctor` route always renders the fixed demo; the active dashboard summary is in its dialog. The configured cancer age cutoffs are prototype rules, not clinical screening guidance. No inherited-risk conclusion, diagnosis, medication recommendation, or validated accuracy claim is made.

No hackathon award or individual contribution claims were transferred from AJAI. Confirm accurate credits and choose licensing for this project's original code separately.
