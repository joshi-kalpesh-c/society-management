# Requirements and business rules

## Confirmed scope

Standalone product, separate from Finxone. India, INR. Web plus React Native Android and iOS apps. One society at launch, with provision for multiple societies later.

### Roles and flats

- Society admin manages flats, members, charges, payment verification, notices, campaigns, reminders, and visitor settings.
- Residents access their authorized flats, pay dues, view receipts and notices, and approve visitors.
- Security staff register visitors, obtain approval, record entry/exit, and use permitted timeout fallback.
- A flat can have any number of members authorized to approve visitors; no product-level numeric limit.
- Maintenance and compulsory contributions are owed per flat, not per member.

### Maintenance

- Generate monthly maintenance bills with an admin-defined due date.
- No partial payment of a maintenance bill; the full payable amount is required.
- Late fees begin after the due date.
- Policy supports a fixed daily amount OR a daily percentage with a daily monetary cap.
- No maximum total late fee.
- Show maintenance principal, late fee, payment status, and receipt history separately.

### Payment and receipts

- Admin manually supplies the society's UPI QR.
- On a supported phone, offer to open a compatible installed UPI application.
- Offer QR scanning and clear manual payment instructions as a fallback.
- No automatic verification was requested. A payment claim contains a transaction reference and optional screenshot; admin checks actual bank transactions before confirmation.
- Issue an official numbered PDF receipt only after verification.
- Never treat app launch, a client-side success message, reference text, or a screenshot as proof of settlement.

### Fundraising

- Voluntary: members choose whether and how much to contribute.
- Compulsory minimum: each applicable flat owes at least a specified amount and may contribute more.
- Compulsory fixed: each applicable flat owes the exact amount.
- No late fees on fundraising, including compulsory campaigns.
- Admin-configured reminders target flats that have not fulfilled compulsory obligations.

### Visitor management

- Security registers visitors against a destination flat.
- Authorized members of that flat receive approval requests; any one may approve.
- Default resident response timeout is two minutes.
- Security fallback is enabled by default and configurable in the admin panel, including timeout.
- Fallback permits a deliberate security approval; it does not automatically admit a visitor.
- Record entry and exit.

### Notices

Admin creates and manages notices and notifications. Residents can view a persistent notice history, not only ephemeral push messages.

## Proposed defaults to validate

These are recommendations from planning, not additional owner-confirmed requirements:

- India time zone: Asia/Kolkata. Due-date boundaries are local calendar dates.
- Late fee is non-compounding and calculated on maintenance principal only.
- Percentage fee for a day = min(principal × daily percentage, daily cap), if a cap exists; fixed policy uses its daily amount. Round each day's charge to paise consistently.
- Verified payment uses the actual bank payment date, not the admin-verification date.
- A pending payment claim suppresses ordinary unpaid reminders for its bill/campaign and is shown separately. Rejection restores unpaid status and normal reminders.
- Explicit resident rejection blocks routine security fallback; an override requires a separate, explicitly designed escalation policy if ever needed.
- Security fallback requires a reason, an audit entry, and notification to the flat.
- Fixed compulsory campaigns require a full payment. Minimum campaigns require at least the minimum in one payment; whether incremental contributions are permitted remains open.
- Policies are snapshotted per issued bill. Editing a policy must not silently rewrite existing obligations.
- Residents cannot directly grant themselves access to another flat. Membership changes require authorization.

## Critical payment edge case

A UPI app may allow the payer to change the amount. If an actual transfer is less than the required full amount, do not silently mark the bill paid or discard the money. Record a reconciliation exception and let the admin resolve it through an approved process. Refunds, credits, overpayments, and receipt treatment require a decision before production.

For late fees accruing while a claim is pending, display a dated payable quote and recompute against the verified payment date. A pending claim must not permanently freeze charges if rejected. Do not promise a quote-lock mechanism without deciding its rules.

## Open decisions before implementation

1. Product name, branding, hosting, and repository setup.
2. Authentication method: phone OTP, email/password, or another provider; delivery service and recovery policy.
3. Resident permissions: who invites/removes flat members; owners versus tenants; multiple-flat memberships; who receives each reminder.
4. Maintenance amount rules: same for every flat or configurable by flat/category; treatment of old unpaid months; whether a payment can cover multiple complete bills.
5. Late-fee rounding, daily cap required/optional, and approval of non-compounding/date rules above.
6. Payment mismatch/overpayment/refund process, duplicate references across transfers, bank reconciliation evidence, and whether admins can correct a previously verified payment.
7. Receipt numbering format and any legally required society fields; financial document retention.
8. Reminder scheduling: one-off/recurring, channels, quiet hours, limits, and pending-claim handling.
9. Minimum-campaign incremental contributions and voluntary top-ups after fulfilment.
10. Resident approval/rejection race semantics, cancellation/expiry, offline security handling, visitor data fields and retention.
11. Notice targeting and whether read acknowledgement is needed.
12. Whether one cross-role mobile app is acceptable for security and residents (recommended initially).

## Not included unless separately approved

Automatic bank/payment-provider confirmation, recurring UPI mandates, full accounting, payroll, amenities booking, vehicle management, intercom hardware, visitor QR passes, offline entry authorization, and a cross-society operator portal.
