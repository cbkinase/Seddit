from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, db

subreddit_routes = Blueprint('s', __name__)


@subreddit_routes.route("/")
def get_all_subreddits():
    """
    Returns all subreddits, regardless of user login status.
    """

    all_subreddits = Subreddit.query.all()
    return {"Subreddits": {subreddit.id : subreddit.to_dict() for subreddit in all_subreddits}}


@subreddit_routes.route("/user")
@login_required
def get_user_subreddits():
    """
    Return all subreddits that the user is a member of.
    """
    subreddits = User.query.get(current_user.id).subreddits
    return {"User Subreddits": {subreddit.id : subreddit.to_dict() for subreddit in subreddits}}


@subreddit_routes.route("/id/<int:subreddit_id>")
def get_subreddit_by_pk(subreddit_id):
    """
    Return the information association with a particular subreddit by primary key.
    """
    subreddit = Subreddit.query.get(subreddit_id)
    return subreddit.to_dict()


@subreddit_routes.route("/name/<subreddit_name>")
def get_subreddit_by_name(subreddit_name):
    """
    Return the information association with a particular subreddit by name.
    """
    subreddit = Subreddit.query.filter(Subreddit.name == subreddit_name).first()
    return subreddit.to_dict()


@subreddit_routes.route("/", methods=["POST"])
@login_required
def create_subreddit():
    owner = User.query.get(current_user.id)
    new_subreddit = Subreddit(owner = owner, **request.get_json())
    db.session.add(new_subreddit)
    db.session.commit()
    return new_subreddit.to_dict()
