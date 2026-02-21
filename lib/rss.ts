
import { Guide } from '../types';
import { ORG_DETAILS } from '../constants';

/**
 * Converts a Date object or ISO string to RFC 822 format required by RSS.
 */
const toRFC822 = (dateString?: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toUTCString();
};

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
 * Generates an RSS 2.0 XML string for the provided articles.
 */
export const generateRssFeed = (articles: Guide[]): string => {
  const itemsXml = articles
    .map((article) => {
      const link = `${ORG_DETAILS.url}/${article.slug}`;
      const pubDate = toRFC822(article.date);
      
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${article.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.summary)}</description>
      ${article.featuredImage ? `<enclosure url="${escapeXml(article.featuredImage)}" length="0" type="image/webp" />` : ''}
      <author>${escapeXml(article.author.handle)} (${escapeXml(article.author.name)})</author>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(ORG_DETAILS.name)}</title>
    <link>${ORG_DETAILS.url}</link>
    <description>${escapeXml(ORG_DETAILS.description)}</description>
    <language>te-IN</language>
    <lastBuildDate>${toRFC822()}</lastBuildDate>
    <atom:link href="${ORG_DETAILS.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;
};
