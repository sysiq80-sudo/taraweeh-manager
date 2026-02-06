@echo off
chcp 65001 >nul
title Taraweeh Manager - مدير التراويح

echo ========================================
echo     مدير التراويح - Taraweeh Manager
echo ========================================
echo.

echo [1/3] التحقق من Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo خطأ: Node.js غير مثبت! يرجى تثبيته من https://nodejs.org
    pause
    exit /b 1
)
echo Node.js متاح ✓
echo.

echo [2/3] تثبيت الاعتماديات...
echo هذا قد يستغرق بضع دقائق...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo خطأ في تثبيت الاعتماديات!
    pause
    exit /b 1
)
echo تم تثبيت الاعتماديات بنجاح ✓
echo.

echo [3/3] تشغيل التطبيق...
echo ========================================
echo سيتم فتح التطبيق على: http://localhost:5173
echo اضغط Ctrl+C لإيقاف الخادم
echo ========================================
echo.

npm run dev
pause
