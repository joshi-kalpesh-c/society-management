# Proposed architecture

## Stack proposal

- React + TypeScript web portal for admin and residents.
- React Native + Expo + TypeScript for Android and iOS; role-based resident/security surfaces.
- NestJS API, PostgreSQL, private object storage for QR assets, payment evidence, and PDFs.
- Durable background jobs for reminders, PDF generation, notification delivery, and retries. Choose a queue implementation during setup rather than adding infrastructure speculatively.
- Auth provider and hosting are undecided. Share API schemas and pure domain types, not platform-specific UI indiscriminately.

A modular monolith is sufficient initially: identity/access, societies/flats, billing, payments/receipts, campaigns, notices/notifications, visitors, and audit. No microservices are needed for this scope.

## Tenant isolation and authorization

Every society-owned record carries society_id. Resolve active society membership server-side for every request; never trust a client-supplied society ID or role. Flat-level authorization restricts resident access to linked flats. Security has visitor-related access, not payment evidence or financial administration. Admin authority is society-scoped.

Use tenant-aware foreign keys and uniqueness constraints, deny cross-tenant object access, and test enumeration attempts. Platform-level administration is not a launch requirement.

## Payments

1. Admin configures payee UPI ID/name and uploads a private, validated QR image. Confirm QR destination matches configured details; do not assume the image proves account ownership.
2. API calculates the full amount at a stated time/date and returns bill breakdown and destination details.
3. Client offers a UPI link where supported, or QR/manual instructions. The admin-supplied QR may be static and may not encode the bill amount/reference.
4. Resident pays externally and submits a claim: obligation, amount, reference, payment date, optional evidence.
5. Admin checks society bank records and verifies or rejects the claim.
6. Verification transaction validates ownership, duplicate claims, amount/date, and current obligation state. It atomically records the verified payment and settlement allocation, then schedules receipt generation and notifications through an outbox.
7. PDF generation is idempotent. Retry failures without creating a second payment or receipt number. A verified payment can show 'receipt generating' while the job retries.

No reliable payment callbacks exist for this manual flow. Test UPI launching on real Android/iOS devices and browser combinations; do not assume arbitrary installed apps support the same scheme. Do not embed UPI PIN collection or bank credentials.

Use integer paise for amounts and a documented fixed precision for percentage rates. Never use binary floating point for financial calculations. Financial corrections must retain history; do not delete verified payments or reuse receipt numbers.

## Visitor state machine proposal

PENDING -> RESIDENT_APPROVED or RESIDENT_REJECTED.
PENDING -> SECURITY_APPROVED only after server-calculated eligible time and if fallback was enabled for that request.
Approved -> CHECKED_IN -> CHECKED_OUT.
Additional CANCELLED/EXPIRED transitions require a defined policy.

Snapshot timeout/fallback settings on request creation so configuration edits do not unexpectedly change an active request. Serialize competing transitions using conditional updates/locking: one decision wins; late approvals/rejections cannot overwrite it. The resident rejection-versus-approval race policy must be approved before implementation.

Send notifications after durable request creation. Provide in-app pending requests and security polling/realtime refresh because push delivery is not guaranteed. Client clocks and push delivery time cannot authorize fallback. Offline operation must not bypass server checks.

## Notices and reminders

Keep notice records separate from delivery attempts. Schedule reminders in the society's time zone; evaluate unpaid status immediately before sending. Deduplicate per campaign/flat/scheduled occurrence and recheck after retries. A payment submission and a verification decision should update reminder eligibility without destroying history.

Avoid transaction references, visitor identity details, or sensitive financial data in lock-screen push text. Account for device-token revocation and role/member removal.

## Privacy and operations

- TLS, securely stored credentials, rate limits, audit logs, and short-lived authorized download URLs.
- Private attachments with size/type validation; malware scanning strategy before accepting production evidence uploads.
- Retention/deletion policy for visitor details and screenshots, distinct from required financial retention.
- Minimal visitor information; do not collect identity-document images by default.
- Encrypted backups with tested restoration, monitoring, queue failure alerts, and reconciliation reports.
- Review applicable Indian privacy, society, and financial record requirements before launch.
- No live payments, SMS/push sends, or production changes during development tests.
