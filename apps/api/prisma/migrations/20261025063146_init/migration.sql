-- CreateTable
CREATE TABLE "societies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "societies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "auth_subject" TEXT,
    "email" TEXT,
    "password_hash" TEXT,
    "display_name" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_memberships" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "society_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flats" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,
    "flat_number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "flats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flat_memberships" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "flat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "can_approve_visitors" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "flat_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_settings" (
    "society_id" TEXT NOT NULL,
    "visitor_timeout_seconds" INTEGER NOT NULL DEFAULT 120,
    "security_fallback_enabled" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "society_settings_pkey" PRIMARY KEY ("society_id")
);

-- CreateTable
CREATE TABLE "payment_destinations" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "payee_upi_id" TEXT NOT NULL,
    "payee_name" TEXT NOT NULL,
    "qr_asset_id" TEXT,
    "active_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active_until" TIMESTAMP(3),

    CONSTRAINT "payment_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_policies" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "late_fee_type" TEXT NOT NULL,
    "daily_fixed_paise" INTEGER,
    "daily_rate_bps" INTEGER,
    "daily_cap_paise" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_runs" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_bills" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "flat_id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "principal_paise" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "policy_snapshot" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'issued',
    "settled_principal_paise" INTEGER,
    "settled_late_fee_paise" INTEGER,
    "settled_calc_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mode" TEXT NOT NULL,
    "required_amount_paise" INTEGER,
    "start_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_obligations" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "flat_id" TEXT NOT NULL,
    "required_amount_snapshot_paise" INTEGER,

    CONSTRAINT "campaign_obligations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_rules" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "schedule" JSONB NOT NULL,
    "channels" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "reminder_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_occurrences" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "flat_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "outcome" TEXT,

    CONSTRAINT "reminder_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_claims" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "flat_id" TEXT NOT NULL,
    "submitted_by" TEXT NOT NULL,
    "maintenance_bill_id" TEXT,
    "campaign_id" TEXT,
    "claimed_amount_paise" INTEGER NOT NULL,
    "transaction_reference" TEXT NOT NULL,
    "claimed_paid_at" TIMESTAMP(3) NOT NULL,
    "destination_id" TEXT,
    "evidence_asset_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verified_payments" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "verified_amount_paise" INTEGER NOT NULL,
    "effective_paid_at" TIMESTAMP(3) NOT NULL,
    "verifier_id" TEXT NOT NULL,
    "bank_reference" TEXT,
    "destination_snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verified_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement_allocations" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "maintenance_bill_id" TEXT,
    "campaign_obligation_id" TEXT,
    "voluntary_campaign_id" TEXT,
    "principal_paise" INTEGER NOT NULL,
    "late_fee_paise" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "settlement_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshot" JSONB NOT NULL,
    "asset_id" TEXT,
    "generation_status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_sequences" (
    "society_id" TEXT NOT NULL,
    "numbering_period" TEXT NOT NULL,
    "next_number" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "receipt_sequences_pkey" PRIMARY KEY ("society_id","numbering_period")
);

-- CreateTable
CREATE TABLE "reconciliation_exceptions" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'open',
    "resolution_metadata" JSONB,

    CONSTRAINT "reconciliation_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "author_id" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice_targets" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "notice_id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "target_id" TEXT,

    CONSTRAINT "notice_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject_ref" TEXT,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_attempts" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "provider_ref" TEXT,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "retry_at" TIMESTAMP(3),

    CONSTRAINT "delivery_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_requests" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "flat_id" TEXT NOT NULL,
    "visitor_name" TEXT NOT NULL,
    "purpose" TEXT,
    "visitor_contact" TEXT,
    "requested_by" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fallback_eligible_at" TIMESTAMP(3) NOT NULL,
    "settings_snapshot" JSONB NOT NULL,

    CONSTRAINT "visitor_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_decisions" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "actor_role" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT,
    "decided_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_movements" (
    "request_id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "checked_in_at" TIMESTAMP(3),
    "checked_in_by" TEXT,
    "checked_out_at" TIMESTAMP(3),
    "checked_out_by" TEXT,

    CONSTRAINT "visitor_movements_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "retention_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" TEXT NOT NULL,
    "society_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "idempotency_key" TEXT,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_subject_key" ON "users"("auth_subject");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "society_memberships_society_id_user_id_role_key" ON "society_memberships"("society_id", "user_id", "role");

-- CreateIndex
CREATE INDEX "flats_society_id_idx" ON "flats"("society_id");

-- CreateIndex
CREATE UNIQUE INDEX "flats_society_id_building_id_flat_number_key" ON "flats"("society_id", "building_id", "flat_number");

-- CreateIndex
CREATE INDEX "flat_memberships_society_id_idx" ON "flat_memberships"("society_id");

-- CreateIndex
CREATE UNIQUE INDEX "flat_memberships_flat_id_user_id_key" ON "flat_memberships"("flat_id", "user_id");

-- CreateIndex
CREATE INDEX "payment_destinations_society_id_idx" ON "payment_destinations"("society_id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_society_id_token_key" ON "devices"("society_id", "token");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_policies_society_id_version_key" ON "maintenance_policies"("society_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_runs_society_id_idempotency_key_key" ON "maintenance_runs"("society_id", "idempotency_key");

-- CreateIndex
CREATE INDEX "maintenance_bills_society_id_flat_id_period_idx" ON "maintenance_bills"("society_id", "flat_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_bills_society_id_flat_id_period_key" ON "maintenance_bills"("society_id", "flat_id", "period");

-- CreateIndex
CREATE INDEX "campaigns_society_id_idx" ON "campaigns"("society_id");

-- CreateIndex
CREATE INDEX "campaign_obligations_society_id_campaign_id_flat_id_idx" ON "campaign_obligations"("society_id", "campaign_id", "flat_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_obligations_campaign_id_flat_id_key" ON "campaign_obligations"("campaign_id", "flat_id");

-- CreateIndex
CREATE UNIQUE INDEX "reminder_occurrences_rule_id_flat_id_scheduled_at_key" ON "reminder_occurrences"("rule_id", "flat_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "payment_claims_society_id_status_idx" ON "payment_claims"("society_id", "status");

-- CreateIndex
CREATE INDEX "payment_claims_society_id_flat_id_idx" ON "payment_claims"("society_id", "flat_id");

-- CreateIndex
CREATE UNIQUE INDEX "verified_payments_claim_id_key" ON "verified_payments"("claim_id");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_payment_id_key" ON "receipts"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_society_id_receipt_number_key" ON "receipts"("society_id", "receipt_number");

-- CreateIndex
CREATE INDEX "notices_society_id_status_idx" ON "notices"("society_id", "status");

-- CreateIndex
CREATE INDEX "notifications_society_id_user_id_idx" ON "notifications"("society_id", "user_id");

-- CreateIndex
CREATE INDEX "visitor_requests_society_id_state_flat_id_requested_at_idx" ON "visitor_requests"("society_id", "state", "flat_id", "requested_at");

-- CreateIndex
CREATE INDEX "assets_society_id_idx" ON "assets"("society_id");

-- CreateIndex
CREATE INDEX "audit_events_society_id_created_at_idx" ON "audit_events"("society_id", "created_at");

-- CreateIndex
CREATE INDEX "outbox_events_state_created_at_idx" ON "outbox_events"("state", "created_at");

-- AddForeignKey
ALTER TABLE "society_memberships" ADD CONSTRAINT "society_memberships_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_memberships" ADD CONSTRAINT "society_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flats" ADD CONSTRAINT "flats_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flat_memberships" ADD CONSTRAINT "flat_memberships_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flat_memberships" ADD CONSTRAINT "flat_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "society_settings" ADD CONSTRAINT "society_settings_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_obligations" ADD CONSTRAINT "campaign_obligations_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_occurrences" ADD CONSTRAINT "reminder_occurrences_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "reminder_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verified_payments" ADD CONSTRAINT "verified_payments_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "payment_claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_allocations" ADD CONSTRAINT "settlement_allocations_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "verified_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "verified_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_targets" ADD CONSTRAINT "notice_targets_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "notices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_attempts" ADD CONSTRAINT "delivery_attempts_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_decisions" ADD CONSTRAINT "visitor_decisions_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "visitor_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_movements" ADD CONSTRAINT "visitor_movements_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "visitor_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
