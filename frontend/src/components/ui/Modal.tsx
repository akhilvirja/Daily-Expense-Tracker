import React, { useEffect, useCallback } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    footer?: React.ReactNode;
}

const sizeWidths = {
    sm: '420px',
    md: '560px',
    lg: '720px',
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer,
}) => {
    const handleEsc = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEsc]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 'var(--z-modal-overlay)' as unknown as number,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-bg-modal-overlay)',
                animation: 'fadeIn 0.15s ease-out',
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xl)',
                    width: '90%',
                    maxWidth: sizeWidths[size],
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'scaleIn 0.2s ease-out',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--spacing-xl)',
                        borderBottom: '1px solid var(--color-border-light)',
                    }}
                >
                    <h3
                        style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 600,
                            color: 'var(--color-text-heading)',
                            margin: 0,
                        }}
                    >
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all var(--transition-fast)',
                            lineHeight: 1,
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-hover)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--color-text-heading)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
                        }}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div
                    style={{
                        padding: 'var(--spacing-xl)',
                        overflowY: 'auto',
                        flex: 1,
                    }}
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--spacing-sm)',
                            padding: 'var(--spacing-lg) var(--spacing-xl)',
                            borderTop: '1px solid var(--color-border-light)',
                        }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
