from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, Post, Comment, db, CommentVote, PostVote
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError

search_routes = Blueprint('search', __name__)


@search_routes.route("/", methods=["POST"])
def search_all():
    search = request.get_json().get("search")

    try:
        posts = db.session.query(Post).filter(or_(Post.title.ilike(f"%{search}%"), Post.content.ilike(f"%{search}%"))).all()
        comments = db.session.query(Comment).filter(Comment.content.ilike(f"%{search}%")).all()
        users = db.session.query(User).filter(User.username.ilike(f"%{search}%")).all()
        subreddits = db.session.query(Subreddit).filter(Subreddit.name.ilike(f"%{search}%")).all()
    except SQLAlchemyError as e:
        print(f"Error executing query: {e}")
        return {"errors": "Query failed"}, 500
    return {
    "posts": [post.to_shortest_dict() for post in posts],
    "comments": [comment.to_shortest_dict() for comment in comments],
    "users": [user.to_really_short_dict() for user in users],
    "subreddits": [subreddit.to_med_dict() for subreddit in subreddits],
}
