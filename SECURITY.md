# Security and privacy

Family Health Map is a fictional-data demo. It has no login, patient authorization, persistent patient storage, or clinical approval. Do not enter real patient records or expose it as a clinical service.

## Credentials

Real `.env` files, deployment state, and Git history are excluded from the release. `.env.example` contains configuration names and empty placeholders only. Keep API and service-role keys in server-side environment variables. Never prefix secrets with `NEXT_PUBLIC_` or paste them into GitHub issues.

AI is disabled by default. A configured key alone does not enable it; `ENABLE_AI_EXPLANATIONS=true` must also be set. The public preparation did not reuse the original key or make external AI requests. Optional service credentials are not needed to demonstrate the app.

## Data handling

The UI holds data in React state and resets on reload. Analyze Family sends the current family to this app's API. The endpoint validates it and returns computed results without writing to a database. The optional Supabase helper and schema are not connected to the application.

If AI is enabled later, reduced health-history data is sent to an external provider. Removing names does not make sensitive health information automatically anonymous. External output may contain errors or unsafe statements despite prompt instructions. Assess privacy and review output before any real use.

## Known boundaries

The endpoint is public and has no production rate limiter or request-body size guard. The SQL scaffold has RLS enabled but no ownership model or access policies. Tree connections are illustrative. The configured age thresholds and software rules have not undergone clinical validation. The app does not establish diagnosis, inherited risk, or a screening plan.

## Reporting

Do not publish credentials or health records in an issue. Use GitHub private vulnerability reporting if enabled by the repository owner, or contact the maintainer through a verified private channel. No security contact has been invented for this repository.
