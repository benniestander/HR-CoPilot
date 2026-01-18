
/**
 * Simple GA4 Analytics Wrapper for HR Copilot
 */

type GAEvent =
    | 'plan_comparison_view'
    | 'auth_flow_start'
    | 'onboarding_profile_complete'
    | 'generator_intent_insufficient_credit'
    | 'document_category_interest';

interface GAProps {
    [key: string]: any;
}

export const trackEvent = (eventName: GAEvent, props?: GAProps) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, props);
    } else {
        // Fallback for development/debug
        console.log(`[Analytics Output]: ${eventName}`, props);
    }
};
