@echo off
setlocal
title ScamGuard Pro - Local Server Launcher

:: Default configuration
set PORT=8080
set PY_CMD=python

echo =================================================================
echo       [+] ScamGuard Pro (CyberVigil AI) - Unified Launcher
echo =================================================================
echo.

:: 1. Check command line arguments first
if /I "%~1"=="node" goto RUN_NODE
if /I "%~1"=="python" goto RUN_PYTHON
if /I "%~1"=="py" goto RUN_PYTHON

:: 2. Detect installed environments
set HAS_NODE=0
set HAS_PYTHON=0

node --version >nul 2>&1
if %errorlevel% equ 0 set HAS_NODE=1

python --version >nul 2>&1
if %errorlevel% equ 0 (
    set HAS_PYTHON=1
    set PY_CMD=python
) else (
    py --version >nul 2>&1
    if %errorlevel% equ 0 (
        set HAS_PYTHON=1
        set PY_CMD=py
    )
)

:: 3. Decide based on detected environments
if %HAS_NODE% equ 1 if %HAS_PYTHON% equ 1 goto BOTH_AVAILABLE
if %HAS_NODE% equ 1 goto RUN_NODE
if %HAS_PYTHON% equ 1 goto RUN_PYTHON

:: Neither found
echo [!] Neither Node.js nor Python was detected on your system.
echo.
echo To run ScamGuard Pro, please install either:
echo   - Node.js (https://nodejs.org) OR
echo   - Python  (https://python.org)
echo.
pause
exit /b 1

:BOTH_AVAILABLE
echo Both Node.js and Python are detected on your system!
echo.
echo Select server runtime to launch:
echo   [1] Node.js (Recommended)
echo   [2] Python
echo.
echo Auto-launching Option 1 (Node.js) in 3 seconds...
choice /c 12 /t 3 /d 1 /m "Select option"
if %errorlevel% equ 2 goto RUN_PYTHON
goto RUN_NODE

:RUN_NODE
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js was not found in your PATH.
    pause
    exit /b 1
)
echo.
echo [OK] Launching with Node.js on port %PORT%...
goto START_BROWSER_AND_SERVE_NODE

:RUN_PYTHON
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PY_CMD=python
) else (
    py --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PY_CMD=py
    ) else (
        echo [!] Python was not found in your PATH.
        pause
        exit /b 1
    )
)
echo.
echo [OK] Launching with Python (%PY_CMD%) on port %PORT%...
goto START_BROWSER_AND_SERVE_PYTHON

:START_BROWSER_AND_SERVE_NODE
echo [*] Opening http://localhost:%PORT% in your default browser...
start "" "http://localhost:%PORT%" 2>nul
echo.
echo =================================================================
echo   Server Active: http://localhost:%PORT%/
echo   Press Ctrl+C to stop the server
echo =================================================================
echo.
node -e "const http=require('http'),fs=require('fs'),path=require('path');const m={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};http.createServer((q,r)=>{let u=decodeURI(q.url.split('?')[0]);let p=path.join(process.cwd(),u);if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,d)=>{if(e){r.writeHead(404,{'Content-Type':'text/plain'});r.end('404 Not Found');}else{r.writeHead(200,{'Content-Type':m[path.extname(p).toLowerCase()]||'application/octet-stream'});r.end(d);}});}).listen(%PORT%,'127.0.0.1',()=>console.log('[Node HTTP Server] Listening on http://localhost:%PORT%/'));"
goto END

:START_BROWSER_AND_SERVE_PYTHON
echo [*] Opening http://localhost:%PORT% in your default browser...
start "" "http://localhost:%PORT%" 2>nul
echo.
echo =================================================================
echo   Server Active: http://localhost:%PORT%/
echo   Press Ctrl+C to stop the server
echo =================================================================
echo.
%PY_CMD% -m http.server %PORT%
goto END

:END
endlocal
