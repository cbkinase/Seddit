from crypt import methods
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db, Post, Comment
from ..forms.aws_form import create_upload_form
from app.aws_helpers import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from sqlalchemy.orm import joinedload

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route("/u/<name>")
def user_by_name(name):
    user = User.query.filter(User.username.ilike(name)).first()

    if not user:
        return {"errors": f"User '{name}' not found"}, 404

    return user.to_dict()


@user_routes.route("/u/<int:user_id>", methods=["PUT"])
@login_required
def edit_user_info(user_id):
    if current_user.id != user_id:
        return {"errors": "Not authorized to perform this action"}, 403
    user = User.query.get(user_id)

    if not user:
        return {"errors": f"User #'{user_id}' not found"}, 404
    form_data = request.form
    avatar = request.files.get("avatar")
    username = form_data.get("username")
    bio = form_data.get("bio")
    prev_avatar = user.avatar

    upload = {}

    if avatar:
        form = create_upload_form("avatar")
        form['csrf_token'].data = request.cookies['csrf_token']

        if form.validate_on_submit():
            avatar.filename = get_unique_filename(avatar.filename)
            upload = upload_file_to_s3(avatar, "users")

            if "url" not in upload:
                return {"errors": ["Failed to upload to AWS"]}, 500
        else:
            return {"errors": ["Failed AWS upload validation(s)"]}, 415

        user.avatar = upload.get("url")
        try:
            remove_file_from_s3(prev_avatar)
        except:
            print("Failed to remove existing avatar. Probably a seed delete.")

    if username:
            user.username = username
    if bio:
            user.bio = bio

    if form_data.get("avatar") == "null":
        if user.avatar:
            try:
                remove_file_from_s3(user.avatar)
            except:
                pass
        user.avatar = "https://www.redditstatic.com/avatars/avatar_default_02_A5A4A4.png"
    try:
        db.session.commit()
    except:
        return {"errors": ["Username already taken"]}, 500

    return user.to_dict()


@user_routes.route("/u/<int:user_id>/comments")
def get_user_comments(user_id):
    user = User.query.get(user_id)

    if not user:
        return {"errors": f"User #'{user_id}' not found"}, 404

    page = request.args.get('page', type=int)
    per_page = request.args.get('per_page', type=int)
    limit = None
    offset = None

    if page and per_page:
        offset = (page - 1) * per_page
        limit = per_page

    comments = db.session.query(Comment)\
        .options(joinedload(Comment.votes))\
        .filter(Comment.user_id == user_id)\
        .order_by(
            Comment.id.desc(),
            # Comment.created_at.desc(),
    )

    if (limit):
        comments = comments.limit(limit)
    if (offset):
        comments = comments.offset(offset)

    return {"Comments": {comment.id: comment.to_shortest_dict() for comment in comments}}


@user_routes.route("/u/<username>/posts")
def get_user_posts(username):
    user = User.query.filter(User.username.ilike(username)).first()

    if not user:
        return {"errors": "User not found"}

    return {"Posts": {post.id : post.to_dict() for post in user.posts}}
