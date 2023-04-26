from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, Post, db


post_routes = Blueprint('posts', __name__)


@post_routes.route("/")
def get_all_posts():
    all_posts = Post.query.order_by(Post.created_at.desc()).all()
    return {"Posts": {post.id : post.to_dict() for post in all_posts}}


@post_routes.route("/<int:post_id>")
def get_post_by_id(post_id):
    post = Post.query.get(post_id)

    if not post:
        return {"errors": ["Post not found"]}, 404

    return post.to_dict()


@post_routes.route("/user/<int:user_id>")
def get_all_user_posts(user_id):
    user_posts = Post.query.filter(Post.user_id == user_id)
    return {"Posts": {post.id : post.to_dict() for post in user_posts}}


@post_routes.route("/", methods=["POST"])
@login_required
def create_post():
    author = User.query.get(current_user.id)
    data = request.get_json()
    subreddit_id = data["subreddit_id"]
    subreddit = Subreddit.query.get(subreddit_id)

    new_post = Post(author=author, subreddit=subreddit, title=data.get("title"), content=data.get("content"), attachment=data.get("attachment"))

    try:
        db.session.add(new_post)
        db.session.commit()
        return new_post.to_dict()
    except:
        return {"errors": ["Something went wrong..."]}, 500



@post_routes.route("/<int:post_id>", methods=["PUT"])
@login_required
def edit_post_by_id(post_id):
    post = Post.query.get(post_id)
    post_subreddit_owner = post.subreddit.owner.id

    if not post:
        return {"errors": ["Post not found"]}, 404

    if current_user.id == post.user_id or current_user.id == post_subreddit_owner:

        for key, value in request.get_json().items():
            setattr(post, key, value)

        db.session.commit()
        return post.to_dict()

    return {"errors": ["Not authorized to perform this edit"]}, 403



@post_routes.route("/<int:post_id>", methods=["DELETE"])
@login_required
def delete_post_by_id(post_id):
    post = Post.query.get(post_id)

    if not post:
        return {"errors": ["Post not found"]}, 404

    post_subreddit_owner = post.subreddit.owner.id

    if current_user.id == post.user_id or current_user.id == post_subreddit_owner:
        db.session.delete(post)
        db.session.commit()
        return {"success": "Successfully deleted"}

    return {"errors": ["Not authorized to perform this delete"]}, 403