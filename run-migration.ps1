# رفع Migration إلى Supabase
Write-Host "🚀 بدء تنفيذ migration..." -ForegroundColor Cyan
Write-Host ""

$SUPABASE_URL = "https://bhgxytrbzzqdspumtftj.supabase.co"
$SERVICE_KEY = "sbp_3c84551054eb538cddd13c755d31b1962b922dca"
$MIGRATION_FILE = "supabase/migrations/002_add_share_token.sql"

# قراءة محتوى ملف SQL
Write-Host "📄 قراءة ملف SQL..." -ForegroundColor Yellow
$sqlContent = Get-Content -Path $MIGRATION_FILE -Raw -Encoding UTF8

# تقسيم SQL إلى أوامر منفصلة
$statements = $sqlContent -split ";" | Where-Object { 
    $_.Trim() -ne "" -and -not $_.Trim().StartsWith("--") 
}

Write-Host "📝 عدد الأوامر: $($statements.Count)" -ForegroundColor Yellow
Write-Host ""

# تنفيذ كل أمر
$successCount = 0
$errorCount = 0

foreach ($i in 0..($statements.Count - 1)) {
    $statement = $statements[$i].Trim() + ";"
    
    if ($statement.Length -gt 5) {
        Write-Host "⏳ تنفيذ الأمر $($i + 1)/$($statements.Count)..." -ForegroundColor Gray
        
        try {
            $body = @{
                query = $statement
            } | ConvertTo-Json
            
            $headers = @{
                "Content-Type" = "application/json"
                "apikey" = $SERVICE_KEY
                "Authorization" = "Bearer $SERVICE_KEY"
            }
            
            $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/query" `
                -Method POST `
                -Headers $headers `
                -Body $body `
                -ErrorAction Stop
            
            Write-Host "✅ تم تنفيذ الأمر $($i + 1)" -ForegroundColor Green
            $successCount++
        }
        catch {
            Write-Host "⚠️ تخطي الأمر $($i + 1) (قد يكون موجوداً مسبقاً)" -ForegroundColor Yellow
            $errorCount++
        }
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ اكتمل تنفيذ Migration!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 الإحصائيات:" -ForegroundColor Cyan
Write-Host "   ✅ نجح: $successCount" -ForegroundColor Green
Write-Host "   ⚠️ تخطي: $errorCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 التغييرات المطبقة:" -ForegroundColor Cyan
Write-Host "   • إضافة share_token إلى جدول reading_plans" -ForegroundColor White
Write-Host "   • سياسات RLS للمشاركة العامة" -ForegroundColor White
Write-Host "   • دوال get_or_create_share_token و revoke_share_token" -ForegroundColor White
Write-Host ""
Write-Host "🎉 يمكنك الآن استخدام ميزة المشاركة!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 إذا واجهت أي مشاكل، يمكنك:" -ForegroundColor Yellow
Write-Host "   1. فتح: https://supabase.com/dashboard/project/bhgxytrbzzqdspumtftj/editor" -ForegroundColor Gray
Write-Host "   2. اذهب إلى SQL Editor" -ForegroundColor Gray
Write-Host "   3. انسخ محتوى: supabase/migrations/002_add_share_token.sql" -ForegroundColor Gray
Write-Host "   4. الصقه واضغط Run" -ForegroundColor Gray
Write-Host ""

# انتظار ضغط أي مفتاح
Write-Host "اضغط أي مفتاح للإغلاق..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
