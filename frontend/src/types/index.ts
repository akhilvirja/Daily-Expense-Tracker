// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
    errors?: ValidationError[];
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
}

export interface PaginatedResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T[];
    pagination: PaginationMeta;
    errors?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
}

// ============================================
// Auth & User Types
// ============================================

export interface User {
    id: string;
    fullName: string;
    email: string;
}

export interface AuthResponse {
    id: string;
    fullName: string;
    email: string;
    token: string;
}

// ============================================
// Module 1: Account Types
// ============================================

export type AccountKind = 'bank' | 'cash';

export interface Account {
    id: string;
    userId: string;
    name: string;
    kind: AccountKind;
    openingBalance: number;
    currentBalance: number; // Computed field returned by API
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
}

export interface CreateAccountPayload {
    name: string;
    kind?: AccountKind;
    openingBalance?: number;
    isActive?: boolean;
}

export interface UpdateAccountPayload {
    name?: string;
    kind?: AccountKind;
    openingBalance?: number;
    isActive?: boolean;
}

// ============================================
// Module 2: Category Types
// ============================================

export interface Category {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
}

export interface CreateCategoryPayload {
    name: string;
}

export interface UpdateCategoryPayload {
    name: string;
}

// ============================================
// Module 3: Transaction Types
// ============================================

export type TxnType = 'credit' | 'debit';

export interface Transaction {
    id: string;
    userId: string;
    accountId: string;
    categoryId: string | null;
    type: TxnType;
    amount: number;
    description: string | null;
    occurredOn: string;
    billId: string | null;
    createdAt: string;
    updatedAt: string | null;
    
    // Relations (Populated by API)
    account?: {
        id: string;
        name: string;
        kind: AccountKind;
    };
    category?: {
        id: string;
        name: string;
    };
}

export interface CreateTransactionPayload {
    accountId: string;
    categoryId?: string;
    type: TxnType;
    amount: number;
    description?: string;
    occurredOn: string;
    billId?: string;
}

export interface UpdateTransactionPayload {
    accountId?: string;
    categoryId?: string;
    type?: TxnType;
    amount?: number;
    description?: string;
    billId?: string;
}

export interface TransferPayload {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string;
    occurredOn: string;
}
