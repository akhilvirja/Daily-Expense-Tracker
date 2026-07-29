import React, { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const toastStyles: Record<ToastType, { bg: string; color: string; icon: string }> = {
    success: { bg: 'var(--color-success)', color: 'white', icon: '✓' },
    error: { bg: 'var(--color-danger)', color: 'white', icon: '✕' },
    warning: { bg: 'var(--color-warning)', color: 'white', icon: '⚠' },
    info: { bg: 'var(--color-info)', color: 'white', icon: 'ℹ' },
};

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    isVisible,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const styles = toastStyles[type];

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 'var(--z-toast)' as unknown as number,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                backgroundColor: styles.bg,
                color: styles.color,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                animation: 'slideInRight 0.3s ease-out',
                maxWidth: '400px',
            }}
        >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>{styles.icon}</span>
            <span style={{ flex: 1 }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: '2px',
                    fontSize: '14px',
                    opacity: 0.8,
                    lineHeight: 1,
                }}
            >
                ✕
            </button>
        </div>
    );
};
