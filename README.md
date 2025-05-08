# Getting started

0. Copy the `config_example.py` file to `config.py` and fill in the values
    - `cp config_example.py config.py`
1. Start a virtual environment
    - `python3 -m venv venv`
    - `source venv/bin/activate`
2. Install python dependencies
    - `pip install -r requirements.txt`
3. Install node dependencies
    - `npm install`
4. Start the python server
    - `python server.py`
5. Start the client
    - `npm start`


## 개요 
go to `Backend/serverscripts` and run:

<서버 역할>
* `FrontPageServer.py`: 이력서 처리 및 분석 관련 API를 제공하는 서버 (포트 4000)
* `run.py`: 사용자 인증, 직업 데이터, 대시보드 관련 API를 제공하는 서버 (포트 5001)
* `resume/app.py`: 레쥬메 서버 실행 (포트 8000)
* 

