# Phased implementation plan

Planning only. Do not scaffold into finxone-platform. All future work belongs in this independent product folder or its explicitly chosen repository.

## Phase 0 — Resolve rules and choose foundation

- Review REQUIREMENTS.md open decisions, especially authentication, late-fee dates/rounding, payment mismatch handling, member permissions, and contribution instalments.
- Confirm product name, React/NestJS/Expo stack, supported OS/browser versions, storage, hosting, and notification providers.
- UI foundation decided: web uses shadcn/ui + Tailwind CSS + TanStack Table for admin data grids; mobile uses React Native Reusables + NativeWind (same Tailwind paradigm, Expo-compatible). Forms on both surfaces use react-hook-form + zod to match versioned API contracts. Theming must stay CSS-variable/token driven so branding and dark mode can be made dynamic later; Mantine is the fallback if Tailwind is rejected during setup.
- Confirm operational responsibility for daily payment verification and rejected claims.
- Define visitor retention, financial retention, and approved notice/reminder channels.

Acceptance: documented owner decisions; no unresolved rule hidden as an implementation assumption.

## Phase 1 — Project setup, identity, and tenancy

- Create independent source repository structure for API, web, mobile, and shared contracts using supported, pinned tool versions.
- Configure lint, type checking, automated tests, environment templates without secrets, migrations, CI, and local development.
- Implement authentication, society memberships, admin/security/resident roles, buildings, flats, and flat members.
- Seed fictional development users across two societies to exercise isolation even though production starts with one.

Acceptance: authorized sign-in and membership management; cross-society and cross-flat access tests fail safely; no reliance on Finxone.

## Phase 2 — Maintenance domain and admin screens

- Implement versioned maintenance policies, monthly preview/generation, due dates, and deterministic late-fee calculation.
- Build admin policy/generation screens and resident bill list/details.
- Define immutable snapshots and financial correction rules.

Acceptance: duplicate generation prevented; fixed and percentage fees, daily caps, no total cap, non-compounding if approved, date boundaries, and rounding tested. No partial maintenance settlement accepted.

## Phase 3 — Manual UPI, verification, and receipts

- Configure admin QR/UPI destination and private evidence uploads.
- Build mobile UPI launch plus fallback and web QR/manual instructions.
- Add claim submission, pending/rejected/verified states, admin reconciliation queue, transaction-safe verification, and outbox processing.
- Generate numbered PDF receipts with private authorized access.
- Implement the approved mismatch/overpayment and correction policy before handling real funds.

Acceptance: app launch never marks a bill paid; no receipt before bank verification; duplicate/concurrent verification cannot settle twice; verified effective payment date determines fees; evidence and PDFs cannot leak across flats/societies. Receipt job retries do not duplicate numbers or payments. Test on physical Android and iOS devices.

## Phase 4 — Notices, campaigns, and reminders

- Build draft/published notices and in-app notification history.
- Implement voluntary, compulsory minimum, and compulsory fixed campaigns with per-flat tracking.
- Add admin-configured reminder scheduling, eligibility previews, deduplication, retries, and delivery history.
- Implement push notifications with safe payloads and real-device permission flows.

Acceptance: no fundraising late fees; campaign constraints enforced; paid flats excluded from reminders; pending claim behavior matches approved policy; retries and repeated scheduler runs do not spam. Unauthorized audiences cannot read notices.

## Phase 5 — Visitor management

- Build security registration, resident approval inbox, server-authorized fallback, entry, and exit.
- Default timeout: 120 seconds; fallback enabled; expose admin configuration.
- Add audit reason and resident notification for security fallback, if proposed safeguard approved.
- Handle concurrency, connectivity failures, notification loss, and stale requests without granting implicit entry.

Acceptance: multiple eligible members can respond but only one valid terminal decision wins; security cannot approve early; disabled fallback blocks override; explicit rejection blocks routine fallback under the approved policy; client-clock manipulation changes nothing; check-in requires approval.

## Phase 6 — Integrated quality and launch

- Exercise web, Android, and iOS journeys with admin, resident, and security roles.
- Review accessibility, localization/date formatting, amount display, loading/error states, and notification permissions.
- Test migration/backup restore, queue failures, storage authorization, rate limits, audit visibility, retention jobs, and monitoring alerts.
- Perform a society-admin pilot using fictional payments, followed by an explicitly approved limited real-world pilot.
- Prepare deployment environments and app-store submission assets; signing accounts, provider credentials, legal/privacy materials, and store approvals are external prerequisites.

Acceptance: core journeys pass end-to-end; tenant isolation verified; restore drill succeeds; no unresolved critical finance/security defects; owner approves production rollout.

## Cross-cutting test matrix

- Billing: due date/day-after boundary in Asia/Kolkata, month/year boundaries, fixed/percentage/cap, paise rounding, long-overdue totals, verification delay.
- Payments: pending/rejected/duplicate claims, wrong amount/date, concurrent settlement, repeated callbacks/jobs, changed QR destination, missing upload, PDF failure and retry.
- Campaigns: all modes, target-flat snapshots, unpaid versus pending versus fulfilled, minimum overpayment, no late fees under any configuration.
- Visitors: two-minute boundary, config changes with active requests, simultaneous decisions, rejected request, disabled fallback, duplicate check-in/out, revoked member.
- Access: role escalation, object ID guessing, society isolation, flat isolation, leaked asset URLs, revoked devices and memberships.
- Delivery: scheduler retries, duplicate schedules, time-zone boundaries, provider downtime, notification permission denied.

## Deliverables and completion evidence

For each phase: scoped source changes, migrations where needed, automated test results, updated contracts, and a short acceptance checklist. Actual commands depend on the eventual project setup and must be recorded then; no test/build commands exist yet.

These documents do not promise a timeline or constitute working application code. Start implementation only after explicit instruction and the relevant Phase 0 decisions.
