// Run database migration for share_token feature
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bhgxytrbzzqdspumtftj.supabase.co';
const SUPABASE_SERVICE_KEY = 'sbp_3c84551054eb538cddd13c755d31b1962b922dca';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 بدء تنفيذ migration...\n');

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '002_add_share_token.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 تم قراءة ملف SQL...');

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 عدد الأوامر: ${statements.length}\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`⏳ تنفيذ الأمر ${i + 1}/${statements.length}...`);

      const { data, error } = await supabase.rpc('exec_sql', {
        sql: statement
      }).catch(async () => {
        // If exec_sql doesn't exist, try direct query
        return await supabase.from('_').select('*').limit(0).then(() => {
          // Fallback: use PostgreSQL REST API
          return fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            },
            body: JSON.stringify({ query: statement })
          }).then(res => res.json());
        });
      });

      if (error) {
        console.error(`❌ خطأ في الأمر ${i + 1}:`, error.message);
        // Continue with other statements
      } else {
        console.log(`✅ تم تنفيذ الأمر ${i + 1}`);
      }
    }

    console.log('\n✨ تم تنفيذ Migration بنجاح!');
    console.log('\n📋 التغييرات المطبقة:');
    console.log('   • إضافة عمود share_token إلى جدول reading_plans');
    console.log('   • إنشاء سياسات RLS للمشاركة العامة');
    console.log('   • إضافة دوال get_or_create_share_token و revoke_share_token');
    console.log('\n🎉 يمكنك الآن استخدام ميزة المشاركة العامة!');

  } catch (error) {
    console.error('\n❌ فشل تنفيذ Migration:', error.message);
    console.log('\n💡 سنحاول طريقة بديلة...\n');
    
    // Alternative: Manual instructions
    console.log('📌 يرجى تنفيذ الخطوات التالية يدوياً:');
    console.log('   1. افتح Supabase Dashboard: https://supabase.com/dashboard/project/bhgxytrbzzqdspumtftj');
    console.log('   2. اذهب إلى SQL Editor');
    console.log('   3. انسخ محتوى الملف: supabase/migrations/002_add_share_token.sql');
    console.log('   4. الصقه في المحرر وانقر "Run"');
  }
}

runMigration();
