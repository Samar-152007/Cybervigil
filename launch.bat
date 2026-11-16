@echo off
setlocal
pushd "%~dp0"
title CyberVigil - Server Launcher

echo =================================================================
echo       [+] CyberVigil - Unified Launcher
echo =================================================================
echo.

:: Check for command line arguments
if /I "%~1"=="sync" goto SYNC_MOBILE
if /I "%~1"=="mobile" goto SYNC_MOBILE
if /I "%~1"=="android" goto OPEN_ANDROID

:: 1. Check for Node.js (Primary runtime)
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Node.js runtime detected.
    echo [*] Starting CyberVigil server...
    echo.
    node server.js
    if %errorlevel% neq 0 (
        echo.
        echo [!] Server exited with status code %errorlevel%.
        pause
    )
    goto DONE
)

:: 2. Fallback to Python if Node.js is not present
set PY_CMD=
python --version >nul 2>&1
if %errorlevel% equ 0 set PY_CMD=python

if not defined PY_CMD (
    py --version >nul 2>&1
    if %errorlevel% equ 0 set PY_CMD=py
)

if defined PY_CMD (
    echo [*] Python runtime detected (%PY_CMD%).
    echo [*] Opening default web browser at http://localhost:8080 ...
    start "" "http://localhost:8080" 2>nul
    echo [*] Starting Python HTTP server on port 8080...
    echo.
    %PY_CMD% -m http.server 8080
    if %errorlevel% neq 0 (
        echo.
        echo [!] Python server exited with status code %errorlevel%.
        pause
    )
    goto DONE
)

:: 3. Neither runtime found
echo [!] Neither Node.js nor Python was found on your system.
echo.
echo To run CyberVigil locally, please install Node.js:
echo    https://nodejs.org/
echo.
pause
goto DONE

:SYNC_MOBILE
echo.
echo [*] Step 1: Packaging web assets into /www ...
call node build.js
echo.
echo [*] Step 2: Synchronizing assets with Android and iOS projects...
call npx cap sync
echo.
echo =================================================================
echo   [OK] Mobile Synchronization Complete!
echo   * Android project: ./android
echo   * iOS project:     ./ios
echo =================================================================
echo.
pause
goto DONE

:OPEN_ANDROID
echo.
echo [*] Building and opening Android Studio...
call node build.js
call npx cap sync
call npx cap open android
goto DONE

:DONE
popd
endlocal
