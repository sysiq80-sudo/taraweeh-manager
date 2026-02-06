import fs from 'fs';
import https from 'https';
import path from 'path';

const SUPABASE_URL = 'bhgxytrbzzqdspumtftj.supabase.co';
const SERVICE_KEY = 'sbp_3c84551054eb538cddd13c755d31b1962b922dca';

console.log('🚨 EMERGENCY: Executing infinite recursion fix...\n');

// Read the emergency migration file
const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260206091000_emergency_fix_infinite_recursion.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

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
          console.log(`✅ Statement ${index + 1}: ${sql.substring(0, 60)}...`);
          completed++;
        } else {
          console.log(`⚠️  Statement ${index + 1}: ${res.statusCode} - ${sql.substring(0, 60)}...`);
          console.log(`    Response: ${data}`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`❌ Statement ${index + 1} failed: ${e.message}`);
      failed++;
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

// Execute all statements sequentially
async function runAll() {
  for (let i = 0; i < statements.length; i++) {
    await executeStatement(statements[i], i);
    // Small delay between statements
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n✨ Migration complete!`);
  console.log(`   Executed: ${completed}`);
  console.log(`   Failed: ${failed}`);
  
  if (completed === statements.length) {
    console.log('\n✅ All statements executed successfully!');
    console.log('   The infinite recursion error should be FIXED.');
    console.log('   The app should now be responsive.');
  }
}

runAll();
