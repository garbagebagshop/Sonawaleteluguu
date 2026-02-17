
import { Guide } from '../types';
import { ORG_DETAILS } from '../constants';
import { PAGE_CONTENT } from '../constants/pageContent';

/**
 * Escapes special XML characters.
 */
const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
};

/**
 * Generates a standard XML sitemap for the site.
 */
export const generateSitemap = (articles: Guide[]): string => {
  const baseUrl = ORG_DETAILS.url;
  const today = new Date().toISOString().split('T')[0];

  // 1. Root
  let sitemapEntries = `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  // 2. Static Info Pages (from PAGE_CONTENT)
  Object.keys(PAGE_CONTENT).forEach((slug) => {
    sitemapEntries += `
  <url>
    <loc>${baseUrl}/#${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // 3. Dynamic Article Pages
  articles.forEach((article) => {
    const articleDate = article.date ? article.date.split('T')[0] : today;
    sitemapEntries += `
  <url>
    <loc>${baseUrl}/#${escapeXml(article.slug)}</loc>
    <lastmod>${articleDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;
};
