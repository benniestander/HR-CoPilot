const fs = require('fs');

// We'll manually list the core ones for now since we can't easily import TS files here without a runner
// In a real prod environment, this would be a TS script integrated into the build.
const policies = [
  'paia-manual', 'expense-reimbursement', 'disciplinary', 'grievance', 'leave',
  'health-and-safety', 'uif', 'termination-of-employment', 'sexual-harassment',
  'electronic-communications', 'recruitment-selection', 'company-vehicle',
  'confidentiality', 'data-protection-privacy', 'remote-hybrid-work', 'byod',
  'working-hours', 'dress-code', 'attendance-punctuality', 'employment-equity',
  'training-development', 'whistleblower', 'alcohol-drug', 'coida', 'social-media'
];

const baseUrl = 'https://hrcopilot.co.za/';
const date = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}library</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

policies.forEach(p => {
  const slug = `${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-template-south-africa`;
  sitemap += `
  <url>
    <loc>${baseUrl}templates/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

sitemap += `\n</urlset>`;

fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log('Sitemap updated with 25+ policy pages');
