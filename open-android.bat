@echo off
setlocal
pushd "%~dp0"
title ScamGuard Pro - Open in Android Studio

echo =================================================================
echo       [+] ScamGuard Pro - Launch Android Studio
echo =================================================================
echo.

echo [*] Synchronizing latest assets...
call node build.js
call npx cap sync

echo.
echo [*] Opening native project in Android Studio...
call npx cap open android
if %errorlevel% neq 0 (
    echo.
    echo [!] Could not open Android Studio automatically.
    echo     You can open the "android" folder directly from Android Studio.
    pause
)

popd
endlocal
