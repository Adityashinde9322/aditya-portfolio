@echo off
title Swara Chaudhari - Portfolio Local Server
cls
echo ================================================================
echo   Starting Local Hosting for Swara Chaudhari's Portfolio
echo ================================================================
echo.
python "%~dp0serve.py"
if %errorlevel% neq 0 (
    echo.
    echo [Fallback] Running default Python HTTP server on port 8000...
    start http://localhost:8000
    python -m http.server 8000
)
pause
