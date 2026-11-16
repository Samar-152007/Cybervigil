@echo off
setlocal
pushd "%~dp0"
title CyberVigil - Android Setup and Launcher

echo =================================================================
echo       [+] CyberVigil - Android Mobile Environment
echo =================================================================
echo.

echo [*] Step 1: Packaging web assets and syncing with Android...
call node build.js
call npx cap sync android
echo.

set "STUDIO_EXE="

if defined CAPACITOR_ANDROID_STUDIO_PATH (
    if exist "%CAPACITOR_ANDROID_STUDIO_PATH%" set "STUDIO_EXE=%CAPACITOR_ANDROID_STUDIO_PATH%"
)

if not defined STUDIO_EXE (
    if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
        set "STUDIO_EXE=C:\Program Files\Android\Android Studio\bin\studio64.exe"
    )
)

if not defined STUDIO_EXE (
    if exist "%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe" (
        set "STUDIO_EXE=%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe"
    )
)

if not defined STUDIO_EXE (
    if exist "C:\Program Files (x86)\Android\Android Studio\bin\studio64.exe" (
        set "STUDIO_EXE=C:\Program Files (x86)\Android\Android Studio\bin\studio64.exe"
    )
)

if defined STUDIO_EXE goto FOUND_STUDIO
goto NOT_FOUND_STUDIO

:FOUND_STUDIO
echo [*] Android Studio detected:
echo     "%STUDIO_EXE%"
echo.
echo [*] Launching Android Studio with project: ./android ...
start "" "%STUDIO_EXE%" "%CD%\android"
echo [OK] Android Studio has been started!
goto FINISH

:NOT_FOUND_STUDIO
echo =================================================================
echo   [!] Android Studio is not installed on this computer.
echo =================================================================
echo.
echo The native Android source code has already been generated in:
echo    "%CD%\android"
echo.
echo To compile this into an APK or run it on an Android device:
echo   1. Download and install Android Studio (Free):
echo      https://developer.android.com/studio
echo.
echo   2. Open Android Studio, click "Open", and select the "android" folder.
echo.
echo -----------------------------------------------------------------
echo   TIP: You can test the full Mobile App right now!
echo -----------------------------------------------------------------
echo   A. On this PC: Run "launch.bat", press F12, and press Ctrl+Shift+M
echo      for the phone layout with mobile bottom navigation.
echo.
echo   B. On your phone: Run "launch.bat" and open the Wi-Fi IP address
echo      shown in the terminal from your phone's browser!
echo =================================================================
goto FINISH

:FINISH
echo.
pause
popd
endlocal
