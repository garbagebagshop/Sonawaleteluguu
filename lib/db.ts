
import { createClient } from '@libsql/client';
import { Guide, PriceData } from '../types';
import { AUTHORS } from '../constants';

/**
 * Connection Logic:
 * - Browser builds can only access `import.meta.env.VITE_*` values.
 * - Node/server builds can access `process.env` values.
 * This helper reads both safely without assuming `process` exists in the browser.
 */
const getEnv = (key: string): string | undefined => {
  const viteEnv = (import.meta as any).env;
  const processEnv = (globalThis as any)?.process?.env;
  return viteEnv?.[`VITE_${key}`] || viteEnv?.[key] || processEnv?.[key];
};

const url = getEnv('TURSO_DATABASE_URL') || getEnv('TURSO_URL');
const authToken = getEnv('TURSO_AUTH_TOKEN');

// The client is only initialized if a URL exists. 
// This prevents the "URL_INVALID" crash while allowing the app to run offline.
export const client = url ? createClient({
  url,
  authToken: authToken || "",
}) : null;

// Connectivity Health Export
export const getDbStatus = () => ({
  isConnected: !!client,
  urlDetected: !!url,
  tokenDetected: !!authToken,
  provider: "Turso (LibSQL)"
});

const parseSqliteDate = (sqlDate: string) => {
  if (!sqlDate) return new Date();
  const dateStr = sqlDate.includes(' ') ? sqlDate.replace(' ', 'T') + 'Z' : (sqlDate.endsWith('Z') ? sqlDate : sqlDate + 'Z');
  return new Date(dateStr);
};

export const initDb = async () => {
  if (!client) {
    console.warn("SONAWALE DEBUG: Turso URL missing from environment. Database features are disabled.");
    return;
  }

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT,
        content TEXT,
        author_handle TEXT,
        featured_image TEXT,
        image_alt TEXT,
        date TEXT,
        focus_keywords TEXT
      );
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS price_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gold24k INTEGER NOT NULL,
        gold22k INTEGER NOT NULL,
        silver INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("SONAWALE DEBUG: Turso DB connected and schema verified.");
  } catch (error) {
    console.error("SONAWALE DEBUG: Database init failed:", error);
  }
};

export const fetchArticles = async (): Promise<Guide[]> => {
  if (!client) return [];
  try {
    const result = await client.execute("SELECT * FROM articles ORDER BY date DESC");
    if (!result || !result.rows) return [];
    
    return result.rows.map((row: any) => {
      const rawHandle = row.author_handle || '';
      const author = Object.values(AUTHORS).find(a => 
        a.handle.toLowerCase() === rawHandle.toLowerCase() || 
        a.handle.replace('@', '').toLowerCase() === rawHandle.replace('@', '').toLowerCase()
      ) || AUTHORS.skulkarni;
      
      return {
        title: row.title as string,
        slug: row.slug as string,
        summary: row.summary as string,
        content: row.content as string,
        author: author,
        featuredImage: row.featured_image as string,
        imageAlt: row.image_alt as string,
        date: row.date as string,
        focusKeywords: row.focus_keywords as string
      };
    });
  } catch (error) {
    console.error("SONAWALE DEBUG: Failed to fetch articles:", error);
    return [];
  }
};

export const saveArticleToDb = async (article: Guide) => {
  if (!client) throw new Error("Database connection missing. Check your TURSO_URL env variable.");
  await client.execute({
    sql: `INSERT INTO articles (title, slug, summary, content, author_handle, featured_image, image_alt, date, focus_keywords) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      article.title, 
      article.slug, 
      article.summary, 
      article.content, 
      article.author.handle, 
      article.featuredImage || null, 
      article.imageAlt || article.title,
      article.date || new Date().toISOString(),
      article.focusKeywords || null
    ]
  });
};

export const fetchLatestPrices = async (): Promise<PriceData | null> => {
  if (!client) return null;
  try {
    const result = await client.execute("SELECT * FROM price_history ORDER BY id DESC LIMIT 1");
    if (!result || result.rows.length === 0) return null;
    const row = result.rows[0];
    const localDate = parseSqliteDate(row.timestamp as string);
    return {
      gold24k: Number(row.gold24k),
      gold22k: Number(row.gold22k),
      silver: Number(row.silver),
      lastUpdated: localDate.toLocaleTimeString('te-IN')
    };
  } catch (error) {
    return null;
  }
};

export const fetchPriceHistory = async (limit = 7) => {
  if (!client) return [];
  try {
    const result = await client.execute(`SELECT * FROM price_history ORDER BY id DESC LIMIT ${limit}`);
    if (!result || !result.rows) return [];
    
    return result.rows.reverse().map((row: any) => {
      const localDate = parseSqliteDate(row.timestamp as string);
      return {
        time: localDate.toLocaleDateString('te-IN', { weekday: 'short' }),
        price: Number(row.gold24k),
        fullDate: row.timestamp as string
      };
    });
  } catch (error) {
    return [];
  }
};

export const savePriceUpdate = async (prices: Omit<PriceData, 'lastUpdated'>) => {
  if (!client) throw new Error("Database connection missing. Check your TURSO_URL env variable.");
  await client.execute({
    sql: `INSERT INTO price_history (gold24k, gold22k, silver) VALUES (?, ?, ?)`,
    args: [prices.gold24k, prices.gold22k, prices.silver]
  });
};
