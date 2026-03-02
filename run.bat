@echo off

REM Install backend dependencies
echo Installing server dependencies...
pushd server
call npm install
popd

REM Install frontend dependencies
echo Installing client dependencies...
pushd client
call npm install
popd

REM Start both servers in separate terminals
echo Starting ChatGPT App...
echo Backend will run on http://localhost:5500
echo Frontend will run on http://localhost:3000
start cmd /k "cd /d %~dp0server && npm start"
start cmd /k "cd /d %~dp0client && npm start"
