from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, Post, Comment, db, CommentVote, PostVote
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError

search_routes = Blueprint('search', __name__)


@search_routes.route("/", methods=["POST"])
def search_all():
    search = request.get_json().get("search")
    page = request.args.get('page', type=int)
    per_page = request.args.get('per_page', type=int)

    try:
        posts = db.session.query(Post)\
            .filter(or_(Post.title.ilike(f"%{search}%"), Post.content.ilike(f"%{search}%")))\
            .order_by(Post.id.desc())\
            .paginate(page=page, per_page=per_page)

        comments = db.session.query(Comment)\
            .filter(Comment.content.ilike(f"%{search}%"))\
            .order_by(Comment.id.desc())\
            .paginate(page=page, per_page=per_page)

        users = db.session.query(User)\
            .filter(User.username.ilike(f"%{search}%"))\
            .order_by(User.id.desc())\
            .paginate(page=page, per_page=per_page)

        subreddits = db.session.query(Subreddit)\
            .filter(Subreddit.name.ilike(f"%{search}%"))\
            .order_by(Subreddit.id.desc())\
            .paginate(page=page, per_page=per_page)

    except SQLAlchemyError as e:
        print(f"Error executing query: {e}")
        return {"errors": "Query failed"}, 500

    return {
    "posts": [post.to_shortest_dict() for post in posts] if posts else [],
    "comments": [comment.to_shortest_dict() for comment in comments] if comments else [],
    "users": [user.to_really_short_dict() for user in users] if users else [],
    "subreddits": [subreddit.to_med_dict() for subreddit in subreddits] if subreddits else [],
}
