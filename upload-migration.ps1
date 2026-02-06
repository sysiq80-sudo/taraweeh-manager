# Upload Migration to Supabase
Write-Host "Starting migration..." -ForegroundColor Cyan

$SUPABASE_URL = "https://bhgxytrbzzqdspumtftj.supabase.co"
$SERVICE_KEY = "sbp_3c84551054eb538cddd13c755d31b1962b922dca"

# Read SQL file
$sqlContent = Get-Content -Path "supabase/migrations/002_add_share_token.sql" -Raw

Write-Host "Executing SQL commands..." -ForegroundColor Yellow

# Execute via psql if available, otherwise show manual instructions
$psqlCommand = "PGPASSWORD='' psql -h db.bhgxytrbzzqdspumtftj.supabase.co -U postgres -d postgres -f supabase/migrations/002_add_share_token.sql"

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "MANUAL MIGRATION REQUIRED" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Please follow these steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open your browser and go to:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/bhgxytrbzzqdspumtftj/editor" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Click on 'SQL Editor' in the left sidebar" -ForegroundColor White
Write-Host ""
Write-Host "3. Click 'New Query'" -ForegroundColor White
Write-Host ""
Write-Host "4. Copy ALL contents from:" -ForegroundColor White
Write-Host "   supabase\migrations\002_add_share_token.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Paste into the SQL Editor" -ForegroundColor White
Write-Host ""
Write-Host "6. Click 'Run' button (or press Ctrl+Enter)" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "After running the migration, you will have:" -ForegroundColor Cyan
Write-Host "  - share_token column in reading_plans table" -ForegroundColor Gray
Write-Host "  - Public RLS policies for sharing" -ForegroundColor Gray
Write-Host "  - Helper functions for token management" -ForegroundColor Gray
Write-Host ""

# Open browser automatically
Start-Process "https://supabase.com/dashboard/project/bhgxytrbzzqdspumtftj/editor"

Write-Host "Browser opened. Press any key to close..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
