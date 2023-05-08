# Seddit

## Intro

Seddit is a reddit clone, complete with subreddits, posts, comments, voting, and customizable user profiles. <a href="https://cameron-seddit.onrender.com/">Come check it out!</a>

## Technologies used

- Backend: Flask, SQLAlchemy, PostgreSQL
- Frontend: React, Redux


## Demo

<img src="https://github.com/cbkinase/cbkinase.github.io/blob/main/images/reddit-preview.png?raw=true">


## How to Use Locally

1. Install dependencies by running `pipenv install -r requirements.txt`
2. Configure a `.env` file according to `.env.example`
3. Migrate and seed your database and start the backend server by running ```pipenv shell && flask db upgrade && flask seed all && flask run```
4. In the `frontend` directory, run ```npm i && npm start```
5. Your front and back ends will now both be accessible.
