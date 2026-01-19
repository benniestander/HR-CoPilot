import { useEffect, useCallback } from 'react';

interface PaymentModalProps {
    amountInCents: number;
    currency?: string;
    metadata?: any;
    userEmail: string;
    publicKey: string;
    onSuccess: (result: any) => void;
    onCancel: () => void;
    onError: (error: string) => void;
}

declare global {
    interface Window {
        YocoSDK: any;
    }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    amountInCents,
    currency = 'ZAR',
    metadata,
    publicKey,
    onSuccess,
    onCancel,
    onError,
}) => {

    const initializePayment = useCallback(() => {
        if (!window.YocoSDK) {
            console.error("Yoco SDK not available");
            onError("Payment system failed to load. Please refresh and try again.");
            onCancel();
            return;
        }

        try {
            console.log("Initializing Yoco with key:", publicKey.substring(0, 15) + "...");

            const yoco = new window.YocoSDK({
                publicKey: publicKey,
            });

            yoco.showPopup({
                amountInCents: amountInCents,
                currency: currency,
                name: 'HR CoPilot',
                description: 'Payment',
                metadata: metadata || {},
                callback: function (result: any) {
                    if (result.error) {
                        console.error("Yoco Error:", result.error);
                        onError(result.error.message || "Payment was declined.");
                        onCancel();
                    } else {
                        console.log("Yoco Success, token:", result.id);
                        onSuccess(result);
                    }
                },
                onClose: function () {
                    console.log("Yoco popup closed by user");
                    onCancel();
                }
            });

        } catch (err: any) {
            console.error("Yoco Init Error:", err);
            onError("Could not initialize payment: " + err.message);
            onCancel();
        }
    }, [amountInCents, currency, metadata, publicKey, onSuccess, onCancel, onError]);

    useEffect(() => {
        // Load SDK or use existing
        const loadAndInit = () => {
            if (window.YocoSDK) {
                console.log("Yoco SDK already loaded");
                initializePayment();
                return;
            }

            // Check if script is already in DOM
            const existingScript = document.querySelector('script[src*="yoco-sdk"]');
            if (existingScript) {
                // Script exists, check if SDK is available
                const checkSDK = setInterval(() => {
                    if (window.YocoSDK) {
                        clearInterval(checkSDK);
                        initializePayment();
                    }
                }, 100);

                // Timeout after 5 seconds
                setTimeout(() => {
                    clearInterval(checkSDK);
                    if (!window.YocoSDK) {
                        onError("Payment gateway timed out. Please try again.");
                        onCancel();
                    }
                }, 5000);
                return;
            }

            // Load fresh
            const script = document.createElement('script');
            script.src = "https://js.yoco.com/sdk/v1/yoco-sdk-web.js";
            script.async = true;
            script.onload = () => {
                console.log("Yoco SDK loaded");
                // Small delay to ensure SDK is ready
                setTimeout(() => initializePayment(), 50);
            };
            script.onerror = () => {
                console.error("Failed to load Yoco SDK");
                onError("Failed to load payment gateway. Please try again.");
                onCancel();
            };
            document.head.appendChild(script);
        };

        loadAndInit();
    }, [initializePayment, onCancel, onError]);

    // DON'T render any overlay - let Yoco's popup be the only visible element
    // This prevents our backdrop from blocking Yoco's input fields
    return null;
};
