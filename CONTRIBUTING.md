# Contributing

1. Keep changes focused and use fictional test data.
2. Keep pattern decisions in `lib/rules.ts`; AI must never select patterns.
3. Add a regression test when changing rules, validation, or fallback behavior.
4. Check both English and Arabic, including right-to-left layout.
5. Run `npm run typecheck`, `npm test`, `npm run lint`, `npm run build:vercel`, and `npm run build`.
6. Document behavior changes and remaining limits in the pull request.

Do not commit `.env` files, real health records, deployment identifiers, dependency folders, or generated output. Do not claim clinical validation or invent risk percentages. Agree on credits and licensing with the rights holders before accepting substantial contributions or selecting an open-source license.
