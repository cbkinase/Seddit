from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, Post, Comment, db, CommentVote, PostVote
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError

search_routes = Blueprint('search', __name__)


@search_routes.route("/", methods=["POST"])
def search():
    # Query everything by default
    query_for = ["subreddits", "users", "comments", "posts"]
    req = request.get_json()
    search = req.get("search")
    include_only = req.get("include_only")
    page = request.args.get('page', type=int)
    per_page = request.args.get('per_page', type=int)

    if include_only:
        include_list = include_only.split(",")
        query_for = [table for table in query_for if table in include_list]

    try:
        posts = "posts" in query_for and db.session.query(Post)\
            .filter(or_(Post.title.ilike(f"%{search}%"), Post.content.ilike(f"%{search}%")))\
            .order_by(Post.id.desc())\
            .paginate(page=page, per_page=per_page)

        comments = "comments" in query_for and db.session.query(Comment)\
            .filter(Comment.content.ilike(f"%{search}%"))\
            .order_by(Comment.id.desc())\
            .paginate(page=page, per_page=per_page)

        users = "users" in query_for and db.session.query(User)\
            .filter(User.username.ilike(f"%{search}%"))\
            .order_by(User.id.desc())\
            .paginate(page=page, per_page=per_page)

        subreddits = "subreddits" in query_for and db.session.query(Subreddit)\
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
