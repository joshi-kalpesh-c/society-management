export const SocietyRole = {
  Admin: "admin",
  Resident: "resident",
  Security: "security",
} as const;
export type SocietyRole = (typeof SocietyRole)[keyof typeof SocietyRole];

export const MembershipStatus = {
  Active: "active",
  Suspended: "suspended",
  Revoked: "revoked",
} as const;
export type MembershipStatus =
  (typeof MembershipStatus)[keyof typeof MembershipStatus];

export const MaintenanceBillStatus = {
  Issued: "issued",
  PendingClaim: "pending_claim",
  Settled: "settled",
  Cancelled: "cancelled",
} as const;
export type MaintenanceBillStatus =
  (typeof MaintenanceBillStatus)[keyof typeof MaintenanceBillStatus];

export const LateFeeType = {
  Fixed: "fixed",
  Percentage: "percentage",
} as const;
export type LateFeeType = (typeof LateFeeType)[keyof typeof LateFeeType];

export const PaymentClaimStatus = {
  Pending: "pending",
  Verified: "verified",
  Rejected: "rejected",
} as const;
export type PaymentClaimStatus =
  (typeof PaymentClaimStatus)[keyof typeof PaymentClaimStatus];

export const CampaignMode = {
  Voluntary: "voluntary",
  Minimum: "minimum",
  Fixed: "fixed",
} as const;
export type CampaignMode = (typeof CampaignMode)[keyof typeof CampaignMode];

export const CampaignStatus = {
  Draft: "draft",
  Active: "active",
  Closed: "closed",
} as const;
export type CampaignStatus =
  (typeof CampaignStatus)[keyof typeof CampaignStatus];

export const NoticeStatus = {
  Draft: "draft",
  Published: "published",
  Archived: "archived",
} as const;
export type NoticeStatus = (typeof NoticeStatus)[keyof typeof NoticeStatus];

export const VisitorRequestState = {
  Pending: "pending",
  ResidentApproved: "resident_approved",
  ResidentRejected: "resident_rejected",
  SecurityApproved: "security_approved",
  CheckedIn: "checked_in",
  CheckedOut: "checked_out",
  Cancelled: "cancelled",
  Expired: "expired",
} as const;
export type VisitorRequestState =
  (typeof VisitorRequestState)[keyof typeof VisitorRequestState];

export const AssetPurpose = {
  PaymentQr: "payment_qr",
  ClaimEvidence: "claim_evidence",
  ReceiptPdf: "receipt_pdf",
} as const;
export type AssetPurpose = (typeof AssetPurpose)[keyof typeof AssetPurpose];
