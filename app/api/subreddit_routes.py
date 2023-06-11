from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, db, Post

subreddit_routes = Blueprint('s', __name__)


@subreddit_routes.route("/")
def get_all_subreddits():
    """
    Returns all subreddits, regardless of user login status.
    """
    all_subreddits = Subreddit.query.all()
    return {"Subreddits": {subreddit.name : subreddit.to_med_dict() for subreddit in all_subreddits}}


@subreddit_routes.route("/user")
@login_required
def get_user_subreddits():
    """
    Return all subreddits that the user is a member of.
    """
    subreddits = User.query.get(current_user.id).subreddits
    return {"User Subreddits": {subreddit.name : subreddit.to_dict() for subreddit in subreddits}}


@subreddit_routes.route("/id/<int:subreddit_id>")
def get_subreddit_by_pk(subreddit_id):
    """
    Return the information association with a particular subreddit by primary key.
    """
    subreddit = Subreddit.query.get(subreddit_id)

    if not subreddit:
        return {"errors": ["Subreddit not found"]}, 404

    return subreddit.to_dict()


@subreddit_routes.route("/name/<subreddit_name>")
def get_subreddit_by_name(subreddit_name):
    """
    Return the information association with a particular subreddit by name.
    """
    subreddit = Subreddit.query.filter(Subreddit.name.ilike(subreddit_name)).first()

    if not subreddit:
        return {"errors": ["Subreddit not found"]}, 404

    return {"Subreddits": {subreddit.name : subreddit.to_dict()}}


@subreddit_routes.route("/", methods=["POST"])
@login_required
def create_subreddit():
    """
    Route for creating a subreddit.
    """
    owner = User.query.get(current_user.id)
    possible_duplicate = Subreddit.query.filter(Subreddit.name.ilike(request.get_json()['name'])).first()

    if possible_duplicate:
        return {"errors": ["That subreddit name is already taken"]}, 400

    new_subreddit = Subreddit(owner = owner, **request.get_json())

    try:
        db.session.add(new_subreddit)
        new_subreddit.subscribers.append(owner)
        db.session.commit()
        return new_subreddit.to_dict()

    except:
        return {"errors": ["That subreddit name is already taken"]}, 400



@subreddit_routes.route("/<int:subreddit_id>", methods=["PUT"])
@login_required
def edit_subreddit(subreddit_id):
    """
    Edit an existing subreddit, allowable if you are the Owner.
    """
    subreddit = Subreddit.query.get(subreddit_id)

    if not subreddit:
        return {"errors": ["Subreddit not found"]}, 404

    if current_user.id != subreddit.owner_id:
        return {"errors": ["Attempted editor is not owner"]}, 403

    for key, value in request.get_json().items():
        setattr(subreddit, key, value)

    db.session.commit()
    return subreddit.to_dict()


@subreddit_routes.route("/<int:subreddit_id>", methods=["DELETE"])
@login_required
def delete_subreddit(subreddit_id):
    """
    Deletes a subreddit by id, allowing if you are the Owner.
    """
    subreddit = Subreddit.query.get(subreddit_id)

    if not subreddit:
        return {"errors": ["Subreddit not found"]}, 404

    if current_user.id != subreddit.owner_id:
        return {"errors": ["Attempted deleter is not owner"]}, 403

    db.session.delete(subreddit)
    db.session.commit()

    return {
        "success": "Successfully deleted"
     }


@subreddit_routes.route("/<int:subreddit_id>/subscribers", methods=["POST"])
@login_required
def add_subscriber(subreddit_id):
    """
    Adds current user as a subscriber to a given subreddit
    """
    subreddit = Subreddit.query.get(subreddit_id)
    user = User.query.get(current_user.id)

    if not subreddit or not user:
        return {"errors": ["Resource not found"]}, 404

    if user in subreddit.subscribers:
        return {"errors": ["Already in subreddit"]}, 400

    try:
        subreddit.subscribers.append(user)
        db.session.commit()
        return {"success": f"Successfully subscribed {user.username} to {subreddit.name}"}
    except:
        return {"errors": ["Something went wrong..."]}, 500


@subreddit_routes.route("/<int:subreddit_id>/subscribers/<int:subscriber_id>", methods=["DELETE"])
@login_required
def remove_subscriber(subreddit_id, subscriber_id):
    subreddit = Subreddit.query.get(subreddit_id)
    user = User.query.get(subscriber_id)

    if not subreddit or not user:
        return {"errors": ["Resource not found"]}, 404

    if (current_user.id != subreddit.owner_id) and (user.id != subscriber_id):
        return {"errors": ["Not authorized to perform this action"]}, 403

    try:
        subreddit.subscribers.remove(user)
        db.session.commit()
        return {"success": f"Successfully unsubscribed {user.username} from {subreddit.name}"}
    except:
        return {"errors": ["Something went wrong... user may not be subscriber!"]}, 500


@subreddit_routes.route("/<int:subreddit_id>/subscribers")
def get_subreddit_subscribers(subreddit_id):
    subreddit = Subreddit.query.get(subreddit_id)

    if not subreddit:
        return {"errors": ["Subreddit not found"]}, 404

    return {"Subscribers": {subscriber.id : subscriber.to_really_short_dict() for subscriber in subreddit.subscribers}}


@subreddit_routes.route("/name/<subreddit_name>/posts")
def get_subreddit_posts(subreddit_name):
    subreddit = Subreddit.query.filter(Subreddit.name.ilike(subreddit_name)).first()

    if not subreddit:
        return {"errors": ["Subreddit not found"]}, 404

    return {"Posts": {post.id : post.to_dict() for post in subreddit.posts}}
