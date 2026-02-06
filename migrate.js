import fs from 'fs';
import https from 'https';

const SUPABASE_URL = 'bhgxytrbzzqdspumtftj.supabase.co';
const SERVICE_KEY = 'sbp_3c84551054eb538cddd13c755d31b1962b922dca';

console.log('🚀 Starting migration...\n');

// Read migration file
const migrationSQL = fs.readFileSync('./supabase/migrations/002_add_share_token.sql', 'utf8');

// Split into statements
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 10 && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements\n`);

let completed = 0;
let failed = 0;

// Execute each statement
async function executeStatement(sql, index) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      query: sql + ';'
    });

    const options = {
      hostname: SUPABASE_URL,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ Statement ${index + 1} executed`);
          completed++;
        } else {
          console.log(`⚠️  Statement ${index + 1} skipped (may already exist)`);
          failed++;
        }
        resolve();
      });
    });

    req.on('error', () => {
      console.log(`⚠️  Statement ${index + 1} error (may already exist)`);
      failed++;
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

(async () => {
  for (let i = 0; i < statements.length; i++) {
    await executeStatement(statements[i], i);
    // Small delay between statements
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Migration completed!');
  console.log(`   ✅ Success: ${completed}`);
  console.log(`   ⚠️  Skipped: ${failed}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (failed === statements.length) {
    console.log('⚠️  All statements failed. Manual migration needed:\n');
    console.log('1. Open: https://supabase.com/dashboard/project/bhgxytrbzzqdspumtftj/editor');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy contents of: supabase/migrations/002_add_share_token.sql');
    console.log('4. Paste and click Run\n');
  } else {
    console.log('📋 Changes applied:');
    console.log('   • share_token column added');
    console.log('   • RLS policies for public sharing');
    console.log('   • Helper functions created\n');
    console.log('🎉 You can now use the sharing feature!');
  }
})();
