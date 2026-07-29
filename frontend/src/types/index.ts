// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
    errors?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
}

// ============================================
// Module 1: Account Types
// ============================================

export type AccountType = 'bank' | 'cash' | 'wallet';

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    bankName: string | null;
    holderName: string | null;
    initialBalance: number;
    currentBalance: number;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAccountPayload {
    name: string;
    type?: AccountType;
    bankName?: string | null;
    holderName?: string | null;
    initialBalance?: number;
    description?: string | null;
}

export interface UpdateAccountPayload {
    name?: string;
    type?: AccountType;
    bankName?: string | null;
    holderName?: string | null;
    initialBalance?: number;
    description?: string | null;
}
