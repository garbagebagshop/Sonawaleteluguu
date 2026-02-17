
import { createClient } from '@libsql/client';

const url = 'https://telugu-sonwale-vercel-icfg-fctpkxnw9kfbyxywrghysj9s.aws-ap-south-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzExNTQ4NTIsImlkIjoiYjc4ZmY0N2MtNzhlMi00NTlkLWJiYTktZDcxNjYzNTAyZGQyIiwicmlkIjoiNGM5ODhjY2ItZGUwMC00MDMyLWJhNDctZjE1ODlhNWQ1MWQ0In0.nux_sf42GQRnB_S9_IK5tNiagWcd1qSk2V28vDYgYqIgmUKayuT4Lw5GlcMIzjC4ALK9YaKO6neLRtug0-c0DQ';

const client = createClient({ url, authToken });

async function testDatabase() {
    console.log('🔍 Testing Turso Database Connection (HTTPS)...\n');
    try {
        console.log('1. Testing connection...');
        const pingResult = await client.execute('SELECT 1 as test');
        console.log('✅ Connection successful!');
        console.log('   Result:', pingResult.rows[0]);
    } catch (error) {
        console.error('\n❌ Database test failed:', error);
    }
}

testDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
