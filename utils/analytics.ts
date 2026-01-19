/**
 * Analytics utility for tracking user events.
 * Currently uses Custom Events for internal tracking,
 * can be extended to GA4, Mixpanel, etc.
 */

export const trackEvent = (eventName: string, eventDetails: Record<string, any> = {}) => {
    try {
        // 1. Log to console for development visibility
        console.log(`[Analytics] ${eventName}:`, eventDetails);

        // 2. Dispatch a custom browser event for components to listen to (optional)
        const event = new CustomEvent('hr_copilot_event', {
            detail: { name: eventName, ...eventDetails, timestamp: new Date().toISOString() }
        });
        window.dispatchEvent(event);

        // 3. TODO: Send to external providers (GA4 / Mixpanel)
        // if (window.gtag) {
        //   window.gtag('event', eventName, eventDetails);
        // }
    } catch (err) {
        console.error('Analytics tracking failed:', err);
    }
};
