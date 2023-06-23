from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, db, Post
from ..forms.aws_form import create_upload_form
from app.aws_helpers import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from sqlalchemy.orm import joinedload

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

    form_data = request.form
    main_pic = request.files.get("main_pic")
    about = form_data.get("about")
    category = form_data.get("category")
    prev_main_pic = subreddit.main_pic

    upload = {}

    if main_pic:
        form = create_upload_form("main_pic")
        form['csrf_token'].data = request.cookies['csrf_token']

        if form.validate_on_submit():
            main_pic.filename = get_unique_filename(main_pic.filename)
            upload = upload_file_to_s3(main_pic, "subreddits")

            if "url" not in upload:
                return {"errors": ["Failed to upload to AWS"]}, 500
        else:
            return {"errors": ["Failed AWS upload verification(s)"]}, 415

        subreddit.main_pic = upload.get("url")
        try:
            remove_file_from_s3(prev_main_pic)
        except:
            print("Failed to remove existing picture. Probably a seed delete.")

    if about:
        subreddit.about = about
    if category:
        subreddit.category = category

    if form_data.get("main_pic") == "null":
        if subreddit.main_pic:
            try:
                remove_file_from_s3(subreddit.main_pic)
            except:
                pass
        subreddit.main_pic = "https://i.redd.it/72kquwbkihq91.jpg"


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

    if subreddit.main_pic:
        try:
            remove_file_from_s3(subreddit.main_pic)
        except:
            print("Failed to delete from AWS. Probably a seed post delete...")

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

    page = request.args.get('page', type=int)
    per_page = request.args.get('per_page', type=int)
    limit = None
    offset = None

    if page and per_page:
        offset = (page - 1) * per_page
        limit = per_page

    posts = db.session.query(Post)\
        .join(Subreddit, Subreddit.id == Post.subreddit_id)\
        .options(joinedload(Post.subreddit))\
        .filter(Subreddit.name == subreddit_name)\
        .order_by(
            Post.id.desc(),
    )
    if (limit):
        posts = posts.limit(limit)
    if (offset):
        posts = posts.offset(offset)

    return {"Posts": {post.id : post.to_dict() for post in posts}}
