from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, Post, Comment, db


comment_routes = Blueprint('comments', __name__)


@comment_routes.route("/", methods=["POST"])
@login_required
def create_comment():
    body = request.get_json()
    user = User.query.get(current_user.id)
    post = Post.query.get(body.get("post_id"))
    parent = None
    if body.get("parent_id"):
        parent = Comment.query.get(body.get("parent_id"))

    new_comment = Comment(
        author = user,
        post = post,
        content = body.get("content"),
        parent = parent
    )
    try:
        db.session.add(new_comment)
        db.session.commit()
        # return new_comment.to_short_dict()
        return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}
    except:
        return {"errors": ["Something went wrong..."]}, 500


@comment_routes.route("/<int:comment_id>", methods=["PUT"])
@login_required
def edit_comment(comment_id):
    body = request.get_json()
    post = Post.query.get(body.get("post_id"))
    comment = Comment.query.get(comment_id)

    try:
        comment.content = body["content"]
        db.session.commit()
        # return new_comment.to_short_dict()
        return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}
    except:
        return {"errors": ["Something went wrong..."]}, 500
