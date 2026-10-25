# Proposed database design

Conceptual PostgreSQL schema, not executable migrations. UUID identifiers; UTC timestamps with society-local date calculations; integer paise for money. Every society-owned table includes society_id. Add created_at/updated_at where appropriate.

## Identity and tenancy

| Table | Key fields / purpose |
|---|---|
| societies | id, name, timezone (Asia/Kolkata default), status |
| users | id, auth_subject (unique), display_name, verified contact fields |
| society_memberships | society_id, user_id, role, status; unique society/user/role |
| buildings | society_id, id, name |
| flats | society_id, id, building_id, flat_number, status |
| flat_memberships | society_id, flat_id, user_id, can_approve_visitors, status; unique flat/user |
| society_settings | society_id, visitor_timeout_seconds (120 default), security_fallback_enabled (true default), version |
| payment_destinations | society_id, id, payee_upi_id, payee_name, qr_asset_id, active_from, active_until |
| devices | society_id, user_id, token reference, platform, enabled |

Users may be global identities but access is always through explicit society/flat membership. Decide invitation and member-management rights before implementing them.

## Maintenance

| Table | Key fields / purpose |
|---|---|
| maintenance_policies | society_id, id, version, amount configuration, late_fee_type, daily_fixed_paise OR percentage_rate, optional daily_cap_paise |
| maintenance_runs | society_id, id, period, idempotency_key, generation status |
| maintenance_bills | society_id, id, flat_id, period, principal_paise, due_date, policy_snapshot, lifecycle status |

Prevent duplicate bills for a flat/period within a society. Late-fee calculation should be deterministic from policy snapshots, due dates, and verified effective payment dates; avoid an unnecessary daily-write job just to calculate display amounts. At settlement, persist the final principal/late-fee breakdown and calculation date. Cancellation/correction rules are not yet specified.

## Campaigns

| Table | Key fields / purpose |
|---|---|
| campaigns | society_id, id, title, description, mode (voluntary/minimum/fixed), required_amount_paise, start_date, due_date, status |
| campaign_obligations | society_id, id, campaign_id, flat_id, required_amount_snapshot_paise; unique campaign/flat |
| reminder_rules | society_id, id, campaign_id, schedule configuration, channel configuration, enabled, version |
| reminder_occurrences | society_id, id, rule_id, flat_id, scheduled_at, outcome; unique rule/flat/scheduled occurrence |

Voluntary campaigns do not create mandatory dues. Fundraising records contain no late-fee policy. Snapshot mandatory target flats and amounts so later campaign edits do not silently rewrite obligations.

## Payment claims, settlement, and receipts

| Table | Key fields / purpose |
|---|---|
| payment_claims | society_id, id, flat_id, submitted_by, maintenance_bill_id OR campaign_id, claimed_amount_paise, transaction_reference, claimed_paid_at, destination_id, evidence_asset_id, status, reviewed_by, reviewed_at, review_reason |
| verified_payments | society_id, id, claim_id (unique), verified_amount_paise, effective_paid_at, verifier_id, bank_reference, immutable destination snapshot |
| settlement_allocations | society_id, id, payment_id, maintenance_bill_id OR campaign_obligation_id OR voluntary_campaign_id, principal_paise, late_fee_paise |
| receipts | society_id, id, payment_id (unique for initial one-payment/one-receipt model), receipt_number, issued_at, snapshot, asset_id, generation_status |
| receipt_sequences | society_id, numbering_period, next_number; unique society/period |
| reconciliation_exceptions | society_id, id, claim_id, reason, state, resolution metadata |

Use checks so claims and allocations have exactly one supported target. Verify tenant and flat ownership with tenant-aware foreign keys and server-side validation. A voluntary campaign allocation still references the contributing flat through the payment claim.

A reference string alone is not a universally safe unique bank identifier. Flag suspected duplicate references for review; use verified bank identifiers where reliable and prevent one claim being verified twice. Lock relevant obligation rows during verification to prevent concurrent double settlement.

Keep pending/rejected claims separate from verified money. Full maintenance settlement must cover principal plus late fee as of the effective payment date. Underpayments/overpayments require the unresolved reconciliation policy, not fabricated full settlement. Multiple complete bills per payment are deferred unless approved.

## Notices, visitors, and operational records

| Table | Key fields / purpose |
|---|---|
| notices | society_id, id, title, body, published_at, status, author_id |
| notice_targets | society_id, notice_id, target scope and target ID; constraints per supported scope |
| notifications | society_id, id, user_id, category, subject reference, read_at |
| delivery_attempts | society_id, notification_id, channel, provider reference, state, retry_at |
| visitor_requests | society_id, id, flat_id, visitor_name, purpose, minimal contact if needed, requested_by, state, requested_at, fallback_eligible_at, settings_snapshot |
| visitor_decisions | society_id, request_id, actor_id, decision, actor_role, reason, decided_at |
| visitor_movements | society_id, request_id, checked_in_at/by, checked_out_at/by |
| assets | society_id, id, purpose, storage_key, content_type, size, uploaded_by, retention metadata |
| audit_events | society_id, actor_id, action, entity_type/id, timestamp, safe change metadata |
| outbox_events | society_id, id, event_type, payload reference, processing state, idempotency_key |

## Integrity and indexing

- Tenant-aware foreign keys: referenced entity IDs must belong to the same society.
- Index bill queries by society/flat/period; campaign dues by society/campaign/flat; visitor requests by society/state/flat/request time.
- Enforce nonnegative amounts, valid rate/cap combinations, valid dates, and valid state transitions.
- Unique idempotency keys scoped to actor/operation/society where appropriate.
- Append-only audit and verified financial history; retention controls must not erase legally required records.
- Use database transactions for verification, allocation, receipt-number reservation, and outbox insertion.
