// Database diagnostic script
// Run with: npx tsx db-test.ts

import { createClient } from '@libsql/client';

const url = 'https://telugu-sonwale-vercel-icfg-fctpkxnw9kfbyxywrghysj9s.aws-ap-south-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzExNTQ4NTIsImlkIjoiYjc4ZmY0N2MtNzhlMi00NTlkLWJiYTktZDcxNjYzNTAyZGQyIiwicmlkIjoiNGM5ODhjY2ItZGUwMC00MDMyLWJhNDctZjE1ODlhNWQ1MWQ0In0.nux_sf42GQRnB_S9_IK5tNiagWcd1qSk2V28vDYgYqIgmUKayuT4Lw5GlcMIzjC4ALK9YaKO6neLRtug0-c0DQ';

const client = createClient({ url, authToken: authToken || "" });

async function testDatabase() {
    console.log('🔍 Testing Turso Database Connection...\n');

    try {
        // Test 1: Check connection
        console.log('1. Testing connection...');
        const pingResult = await client.execute('SELECT 1 as test');
        console.log('✅ Connection successful!');
        console.log('   Result:', pingResult.rows[0]);

        // Test 2: Check if tables exist
        console.log('\n2. Checking tables...');
        const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
        console.log('📊 Tables found:', tables.rows.length);
        tables.rows.forEach(row => console.log('  -', row.name));

        // Test 3: Check articles
        console.log('\n3. Checking articles table...');
        try {
            const articlesResult = await client.execute('SELECT COUNT(*) as count FROM articles');
            const articleCount = Number(articlesResult.rows[0]?.count ?? 0);
            console.log(`📝 Articles in database: ${articleCount}`);

            if (articleCount > 0) {
                const recentArticles = await client.execute('SELECT title, date, slug FROM articles ORDER BY date DESC LIMIT 5');
                console.log('\n   Recent articles:');
                recentArticles.rows.forEach((article: any) => {
                    console.log(`   - ${article.title} (${article.date})`);
                });
            } else {
                console.log('⚠️  No articles found in database');
            }
        } catch (err) {
            console.error('❌ Articles table might not exist:', err);
        }

        // Test 4: Check price history
        console.log('\n4. Checking price_history table...');
        try {
            const pricesResult = await client.execute('SELECT COUNT(*) as count FROM price_history');
            const priceCount = Number(pricesResult.rows[0]?.count ?? 0);
            console.log(`💰 Price records in database: ${priceCount}`);

            if (priceCount > 0) {
                const recentPrices = await client.execute('SELECT * FROM price_history ORDER BY timestamp DESC LIMIT 3');
                console.log('\n   Recent prices:');
                recentPrices.rows.forEach((price: any) => {
                    console.log(`   - Gold24K: ${price.gold24k}, Gold22K: ${price.gold22k}, Silver: ${price.silver} (${price.timestamp})`);
                });
            } else {
                console.log('⚠️  No price history found in database');
            }
        } catch (err) {
            console.error('❌ Price_history table might not exist:', err);
        }

        // Test 5: Show table schemas
        console.log('\n5. Table schemas:');
        try {
            const articlesSchema = await client.execute('PRAGMA table_info(articles)');
            console.log('\n📋 Articles table columns:');
            articlesSchema.rows.forEach((col: any) => {
                console.log(`   - ${col.name} (${col.type})`);
            });
        } catch (err) {
            console.log('   Articles table not found');
        }

        try {
            const priceSchema = await client.execute('PRAGMA table_info(price_history)');
            console.log('\n📋 Price_history table columns:');
            priceSchema.rows.forEach((col: any) => {
                console.log(`   - ${col.name} (${col.type})`);
            });
        } catch (err) {
            console.log('   Price_history table not found');
        }

    } catch (error) {
        console.error('\n❌ Database test failed:', error);
    }
}

testDatabase().then(() => {
    console.log('\n✅ Database diagnostic complete!');
    process.exit(0);
}).catch(err => {
    console.error('\n❌ Fatal error:', err);
    process.exit(1);
});
