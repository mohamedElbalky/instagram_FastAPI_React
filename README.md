# Simple Instagram Clone
This project is a simple Instagram-like application built using FastAPI for the backend and React for the frontend. The application allows users to sign up, log in, post images, view posts, and comment on posts.



### Features
- User Authentication (Sign up, Log in, Log out)
- Post Images
- View Posts
- Delete Posts
- Comments System

### Technologies Used
- Backend: FastAPI, SQLAlchemy, Postgres
- Frontend: React, JS, CSS, Material-UI
- JWT (Json Web Token)
- Other Tools: Docker (for containerization)

---

## Setup
### Getting Started
- Python
- Node.js
- Docker (optional, for containerization)

### Backend Setup
1. Clone the repository:
    - `git clone git@github.com:mohamedElbalky/instagram_FastAPI_React.git`
    - `cd instagram_FastAPI_React/backend`
2. Create a virtual environment and activate it:
    - `python -m venv venv`
    - `source venv/bin/activate`
3. Install the dependencies:
    - `pip install -r requirements.txt`
4. Create **.env** file and add environment variables from **.ENV** file.
    - Generate **SECRET_KEY**:
        - In Linux: `openssl rand -base64 64`
    - Add **POSTGRES_DATABASE_URL**:
        - *postgresql://USER_NAME:USER_PASSWORD@localhost:5432/DATABASE_NAME*
5. Run the FastAPI server:
    - `uvicorn src.main:app --reload`
6. To open Endpoints Documentation
    - Open in Browser: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) 

### Frontend Setup
1. Navigate to the frontend directory:
    - `cd ../../frontend`
2. Install the dependencies:
    - `npm install`
3. Run the React development server:
    - `npm run dev`
4. Open in browser:  [http://127.0.0.1:8000](http://localhost:3000) 


### Running with Docker
- Build and run the Docker containers:
    - `git clone git@github.com:mohamedElbalky/instagram_FastAPI_React.git`
    - `docker-compose up --build`

