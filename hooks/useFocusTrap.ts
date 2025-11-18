import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const useFocusTrap = <T extends HTMLElement>(isOpen: boolean, onClose?: () => void) => {
    const modalRef = useRef<T>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Tab' && modalRef.current) {
            const focusableElements = Array.from(
                modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS)
            ) as HTMLElement[];
            
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        } else if (e.key === 'Escape' && onClose) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = Array.from(
                modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS)
            ) as HTMLElement[];
            
            const firstElement = focusableElements[0];
            if (firstElement) {
                // Delay focus to allow for modal transitions
                const timeoutId = setTimeout(() => firstElement.focus(), 100);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    return modalRef;
};