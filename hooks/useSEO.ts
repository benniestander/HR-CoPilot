import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
}

export const useSEO = ({ title, description, canonical }: SEOProps) => {
    useEffect(() => {
        // Set Title
        document.title = title.includes('HR CoPilot') ? title : `${title} | HR CoPilot South Africa`;

        // Set Description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);
        }

        // Set Canonical
        if (canonical) {
            let linkCanonical = document.querySelector('link[rel="canonical"]');
            if (!linkCanonical) {
                linkCanonical = document.createElement('link');
                linkCanonical.setAttribute('rel', 'canonical');
                document.head.appendChild(linkCanonical);
            }
            linkCanonical.setAttribute('href', canonical);
        }
    }, [title, description, canonical]);
};
