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
