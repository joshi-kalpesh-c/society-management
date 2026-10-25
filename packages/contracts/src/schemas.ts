import { z } from "zod";
import {
  CampaignMode,
  LateFeeType,
  SocietyRole,
  VisitorRequestState,
} from "./enums";

export const uuid = z.string().uuid();
export const localDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD local date");
export const paise = z.number().int().nonnegative();

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export const paginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const maintenancePolicySchema = z
  .object({
    amountPaise: paise,
    dueDayOfMonth: z.number().int().min(1).max(28),
    lateFeeType: z.enum([LateFeeType.Fixed, LateFeeType.Percentage]),
    dailyFixedPaise: paise.optional(),
    dailyRateBps: z.number().int().nonnegative().optional(),
    dailyCapPaise: paise.optional(),
  })
  .refine(
    (p) =>
      p.lateFeeType === LateFeeType.Fixed
        ? p.dailyFixedPaise !== undefined &&
          p.dailyRateBps === undefined &&
          p.dailyCapPaise === undefined
        : p.dailyRateBps !== undefined && p.dailyFixedPaise === undefined,
    {
      message:
        "fixed requires dailyFixedPaise only; percentage requires dailyRateBps (+ optional dailyCapPaise)",
    },
  );
export type MaintenancePolicyInput = z.infer<typeof maintenancePolicySchema>;

export const paymentClaimCreateSchema = z.object({
  maintenanceBillId: uuid.optional(),
  campaignId: uuid.optional(),
  claimedAmountPaise: paise,
  transactionReference: z.string().min(4).max(64),
  claimedPaidAt: z.string().datetime(),
  evidenceAssetId: uuid.optional(),
});
export type PaymentClaimCreate = z.infer<typeof paymentClaimCreateSchema>;

export const campaignCreateSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(4000).optional(),
    mode: z.enum([
      CampaignMode.Voluntary,
      CampaignMode.Minimum,
      CampaignMode.Fixed,
    ]),
    requiredAmountPaise: paise.optional(),
    startDate: localDate,
    dueDate: localDate,
    targetFlatIds: z.array(uuid).min(1).optional(),
  })
  .refine(
    (c) =>
      c.mode === CampaignMode.Voluntary
        ? c.requiredAmountPaise === undefined
        : c.requiredAmountPaise !== undefined && c.requiredAmountPaise > 0,
    {
      message:
        "voluntary must not set requiredAmountPaise; minimum/fixed require it > 0",
    },
  );
export type CampaignCreate = z.infer<typeof campaignCreateSchema>;

export const visitorRequestCreateSchema = z.object({
  flatId: uuid,
  visitorName: z.string().min(1).max(120),
  purpose: z.string().max(500).optional(),
});
export type VisitorRequestCreate = z.infer<typeof visitorRequestCreateSchema>;

/** Server-authoritative visitor request view. Client countdown is informational only. */
export const visitorRequestViewSchema = z.object({
  id: uuid,
  state: z.nativeEnum(VisitorRequestState),
  serverNow: z.string().datetime(),
  fallbackEligibleAt: z.string().datetime().nullable(),
  allowedActions: z.array(z.string()),
});
export type VisitorRequestView = z.infer<typeof visitorRequestViewSchema>;

export const noticeCreateSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
});
export type NoticeCreate = z.infer<typeof noticeCreateSchema>;

export const membershipViewSchema = z.object({
  societyId: uuid,
  societyName: z.string(),
  role: z.nativeEnum(SocietyRole),
});
export type MembershipView = z.infer<typeof membershipViewSchema>;
