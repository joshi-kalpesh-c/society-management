# Screens and initial API specification

Proposed implementation contract. Authentication provider and exact DTOs are not finalized.

## Screens

### Shared

Sign in/recovery, society selector (only if multiple memberships), active-flat selector, profile, notification inbox, permission/error states.

### Resident web and mobile

- Home: current dues, payment status, notices, active campaigns.
- Maintenance list and bill details: due date, principal, dated late-fee calculation, full payable total.
- Pay: UPI app action where supported, admin QR, destination, amount, instructions, transaction-reference submission, optional screenshot.
- Payment claims: pending/verified/rejected state and rejection reason.
- Receipt history and private PDF download/share.
- Campaign list/details: voluntary, minimum, fixed contribution rules and fulfilment status.
- Notices list/detail.
- Visitor approval inbox/details: approve/reject, current decision, entry status.
- Flat members: visibility/management subject to the pending membership-permissions decision.

### Admin web

- Dashboard: unpaid maintenance, pending verifications, campaign dues, reminder activity.
- Buildings/flats/members/role management.
- Maintenance policy and monthly generation preview/confirmation.
- Bill and late-fee details.
- UPI destination/QR settings.
- Payment verification queue and reconciliation exceptions.
- Receipts and financial export (export format to be decided).
- Campaign editor, target flats, contribution tracking, reminder schedule editor.
- Notice editor and publication history.
- Visitor log, fallback/timeout settings, audit history.

### Security mobile

- Visitor registration and flat lookup with minimal exposed resident information.
- Pending approvals with server-derived timer/status.
- Security fallback action when eligible, with mandatory reason.
- Approved visitor check-in, checked-in list, check-out, recent history.

Admin parity in the mobile app is not assumed; confirm if required.

## API conventions

Base: /api/v1/societies/:societyId. Authenticate every protected request and validate membership server-side. Resident endpoints also validate flat ownership; admin and security endpoints enforce their role. Suggested JSON errors use stable codes plus readable messages. Pagination on collection routes. ISO timestamps; local due dates as YYYY-MM-DD; money as integer paise.

Use idempotency keys for bill generation, payment claims, and other retryable writes. Return conflict for stale state transitions. Uploads use an authorized asset flow with size/type checks; downloads require object-level authorization. Rate-limit sign-in, uploads, and visitor/payment submissions.

## Endpoint inventory

Paths below are relative to the society base unless stated otherwise.

| Method / route | Role | Behavior / key inputs |
|---|---|---|
| GET /api/v1/me | Authenticated | Identity and permitted society memberships |
| GET /flats | Admin; scoped resident/security views | Paginated flats with role-appropriate fields |
| POST /flats | Admin | Create flat in society/building |
| PATCH /flats/:id | Admin | Update permitted flat fields |
| GET /flats/:id/members | Authorized member/admin | Members of permitted flat |
| POST /flats/:id/members | Admin initially | Authorized invitation/linking, not arbitrary role grants |
| PATCH /flats/:id/members/:memberId | Admin initially | Permissions/status changes |
| GET /maintenance-policies | Admin | Versioned policies |
| POST /maintenance-policies | Admin | New validated policy version |
| POST /maintenance-runs/preview | Admin | Period, flat scope, policy; no bills written |
| POST /maintenance-runs | Admin | Idempotent confirmed generation |
| GET /maintenance-bills | Admin/resident scoped | Filters by period, flat, state |
| GET /maintenance-bills/:id | Admin/resident scoped | Bill, fee breakdown, claims, settlement |
| GET /maintenance-bills/:id/payable | Admin/resident scoped | Dated amount and destination; not proof of payment |
| GET /payment-destination | Admin/resident | Active validated destination and authorized QR access |
| PUT /payment-destination | Admin | Version destination/QR; preserve old payment snapshots |
| POST /payment-claims | Resident/admin scoped | Target, amount, reference, claimed payment date, evidence asset |
| GET /payment-claims | Admin/resident scoped | Verification queue or own flat's claims |
| POST /payment-claims/:id/verify | Admin | Bank-checked date/amount/reference; atomic settlement |
| POST /payment-claims/:id/reject | Admin | Reason; retain claim history |
| GET /receipts | Admin/resident scoped | Authorized receipt metadata |
| GET /receipts/:id/download | Admin/resident scoped | Short-lived private PDF access |
| POST /campaigns | Admin | Mode, amount if mandatory, dates, target flats |
| PATCH /campaigns/:id | Admin | Validated edits without rewriting settled obligations |
| GET /campaigns | Admin/resident scoped | Active/history listing |
| GET /campaigns/:id | Admin/resident scoped | Rules and permitted contribution status |
| PUT /campaigns/:id/reminder-rules | Admin | Schedule/channels/enabled; validation and preview |
| POST /campaigns/:id/reminders/preview | Admin | Eligible flat/recipient counts, no send |
| GET /campaigns/:id/contributions | Admin; own-flat resident view | Verified/pending contributions and obligations |
| POST /notices | Admin | Draft with audience |
| PATCH /notices/:id | Admin | Update draft or permitted publication details |
| POST /notices/:id/publish | Admin | Durable publication plus queued deliveries |
| GET /notices | Scoped members | Authorized published notices |
| GET /notifications | Authenticated member | Own inbox |
| PATCH /notifications/:id/read | Recipient | Mark own notification read |
| POST /devices | Authenticated member | Register device for own notifications |
| DELETE /devices/:id | Owner | Revoke device |
| GET /visitor-settings | Admin/security | Current timeout/fallback configuration |
| PATCH /visitor-settings | Admin | Timeout and enabled flag, audited |
| POST /visitor-requests | Security | Flat, minimal visitor details; snapshot settings |
| GET /visitor-requests | Scoped roles | Admin/security log or own-flat requests |
| POST /visitor-requests/:id/approve | Authorized resident | Atomic decision if pending |
| POST /visitor-requests/:id/reject | Authorized resident | Atomic decision if pending |
| POST /visitor-requests/:id/security-approve | Security | Server timeout check, pending state, fallback enabled, reason |
| POST /visitor-requests/:id/check-in | Security | Require valid approval; idempotent movement |
| POST /visitor-requests/:id/check-out | Security | Require checked-in state |
| POST /assets/uploads | Scoped roles | Purpose-specific authorized upload initialization |
| POST /assets/:id/complete | Owner/authorized role | Validate uploaded object before use |
| GET /audit-events | Admin | Paginated, society-scoped, safe audit data |

## Contract examples

Maintenance policy: lateFeeType=fixed with dailyFixedPaise, OR lateFeeType=percentage with dailyRate and optional dailyCapPaise. No totalCap field. Rate representation must be chosen consistently before coding.

Campaign: mode=voluntary requires no mandatory amount; mode=minimum/fixed requires requiredAmountPaise > 0. No late-fee fields accepted.

Visitor request response includes serverNow, state, fallbackEligibleAt, and allowedActions. Client countdown is informational; server checks remain authoritative.

Payment verification returns verified payment ID, final allocation breakdown, and receipt status. A second identical verification is idempotent; conflicting verification is rejected. DTO validation, error codes, and versioned OpenAPI schemas are deliverables of the API phase.
