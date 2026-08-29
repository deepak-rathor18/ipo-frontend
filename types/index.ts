// ==================== AUTH ====================

export type UserName = "Deepak" | "Aman";

export interface User {
  id: string;
  name: UserName;
}

export interface LoginPayload {
  user: UserName;
  authCode: string;
}

// ==================== API ENVELOPE ====================

export interface APIResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface APIError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

// ==================== IPO ====================

export type IPOStatus =
  | "APPLIED"
  | "ALLOTTED"
  | "NOT_ALLOTTED"
  | "PARTIALLY_ALLOTTED"
  | "LISTED"
  | "REFUNDED";

export interface IPO {
  id: string;
  ipoName: string;
  companyName: string;
  appliedDate: string;
  dematName: string;
  applicationAmount: number;
  lotSize: number;
  lotsApplied: number;
  sharesApplied: number;
  applicationPrice: number;
  status: IPOStatus;
  allottedShares: number | null;
  allotmentPrice: number | null;
  listingDate: string | null;
  listingPrice: number | null;
  currentPrice: number | null;
  listingProfitLoss: number | null;
  currentProfitLoss: number | null;
  notes: string | null;
  createdBy: UserName;
  createdAt: string;
  updatedAt: string;
}

export type IPOFormValues = Omit<
  IPO,
  | "id"
  | "createdBy"
  | "createdAt"
  | "updatedAt"
  | "listingProfitLoss"
  | "currentProfitLoss"
>;

export interface IPOFilters {
  search?: string;
  status?: IPOStatus | "ALL";
  dematName?: string;
  dateFrom?: string;
  dateTo?: string;
  year?: string;
  month?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ==================== MONEY ====================

export type MoneyType = "GIVEN" | "BORROWED";
export type MoneyStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";

export interface Repayment {
  id: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  notes: string | null;
  createdBy: UserName;
  createdAt: string;
}

export interface MoneyTransaction {
  id: string;
  personName: string;
  phone: string | null;
  type: MoneyType;
  amount: number;
  totalPaid: number;
  remaining: number;
  transactionDate: string;
  dueDate: string | null;
  reason: string | null;
  notes: string | null;
  status: MoneyStatus;
  createdBy: UserName;
  createdAt: string;
  updatedAt: string;
}

export type MoneyFormValues = Omit<
  MoneyTransaction,
  | "id"
  | "totalPaid"
  | "remaining"
  | "status"
  | "createdBy"
  | "createdAt"
  | "updatedAt"
>;

export interface MoneyFilters {
  search?: string;
  type?: MoneyType | "ALL";
  status?: MoneyStatus | "ALL";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ==================== PEOPLE ====================

export interface PersonSummary {
  personName: string;
  totalGiven: number;
  totalBorrowed: number;
  totalReceived: number;
  totalPaid: number;
  remainingAmount: number;
}


// ==================== AUDIT ====================

export interface AuditLog {
  id: string;
  entityType: "IPO" | "MONEY" | "REPAYMENT";
  entityId: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  performedBy: UserName;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  createdAt: string;
}

// ==================== DASHBOARD ====================

export interface DashboardSummary {
  ipo: {
    totalApplications: number;
    totalApplicationAmount: number;
    totalActualInvestment: number;
    totalAllotted: number;
    totalNotAllotted: number;
    totalListingProfitLoss: number;
    totalCurrentProfitLoss: number;
  };

  money: {
    totalMoneyGiven: number;
    totalMoneyBorrowed: number;
    moneyToReceive: number;
    moneyToPay: number;
    pendingReceivable: number;
    pendingPayable: number;
    overdueReceivable: number;
    overduePayable: number;
    netBalance: number;
  };

  netBalance: number;
}

export interface MonthlyPoint {
  month: string;
  value: number;
}

export interface IPODashboardData {
  totalApplications: number;
  totalApplicationAmount: number;
  totalActualInvestment: number;
  totalAllotted: number;
  totalNotAllotted: number;
  totalListingProfitLoss: number;
  totalCurrentProfitLoss: number;
}

export interface MoneyDashboardData {
  totalMoneyGiven: number;
  totalMoneyBorrowed: number;
  moneyToReceive: number;
  moneyToPay: number;
  pendingReceivable: number;
  pendingPayable: number;
  overdueReceivable: number;
  overduePayable: number;
  netBalance: number;
}

// ==================== REPORTS ====================

export type IPOReportRow = IPO;
export type MoneyReportRow = MoneyTransaction;

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  year?: string;
  month?: string;
  dematName?: string;
  status?: string;
}
