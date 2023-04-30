from crypt import methods
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db

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

    for key, value in request.get_json().items():
        setattr(user, key, value)

    db.session.commit()

    return user.to_dict()


@user_routes.route("/u/<int:user_id>/comments")
def get_user_comments(user_id):
    user = User.query.get(user_id)

    if not user:
        return {"errors": f"User #'{user_id}' not found"}, 404

    return {comment.id: comment.to_short_dict() for comment in user.comments}
