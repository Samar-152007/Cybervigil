@echo off
setlocal
pushd "%~dp0"
title ScamGuard Pro - Mobile Sync

echo =================================================================
echo       [+] ScamGuard Pro - Mobile Synchronizer (Android & iOS)
echo =================================================================
echo.

echo [*] Step 1: Packaging web assets into /www ...
call node build.js
if %errorlevel% neq 0 (
    echo [!] Build failed.
    pause
    goto DONE
)

echo.
echo [*] Step 2: Synchronizing assets with Android and iOS projects...
call npx cap sync
if %errorlevel% neq 0 (
    echo [!] Capacitor sync failed.
    pause
    goto DONE
)

echo.
echo =================================================================
echo   [OK] Synchronization Complete!
echo   * Android project: ./android
echo   * iOS project:     ./ios
echo =================================================================
echo.
pause

:DONE
popd
endlocal
