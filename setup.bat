@echo off
echo Setting up PhishGuard AI System...

echo [1/6] Setting up NLP Service...
cd nlp-service
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python train.py
copy .env.example .env
deactivate
cd ..

echo [2/6] Setting up URL Service...
cd url-service
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python train.py
copy .env.example .env
deactivate
cd ..

echo [3/6] Setting up Visual Service...
cd visual-service
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python train.py
copy .env.example .env
deactivate
cd ..

echo [4/6] Setting up Detection API...
cd detection-api
call npm install
copy .env.example .env
call npm run build
cd ..

echo [5/6] Setting up API Gateway...
cd api-gateway
call npm install
copy .env.example .env
call npm run build
cd ..

echo [6/6] Setting up Frontend...
cd frontend
call npm install
copy .env.example .env
cd ..

echo Setup complete! Run start-all.bat to launch the system.
pause
