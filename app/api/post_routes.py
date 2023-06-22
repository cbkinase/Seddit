from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, Post, Comment, db, CommentVote, PostVote
from ..forms.aws_form import UploadForm
from app.aws_helpers import get_unique_filename, upload_file_to_s3, remove_file_from_s3


post_routes = Blueprint('posts', __name__)


@post_routes.route("/")
def get_all_posts():
    page = request.args.get('page', type=int)
    per_page = request.args.get('per_page', type=int)
    limit = None
    offset = None

    if page and per_page:
        offset = (page - 1) * per_page
        limit = per_page


    # all_posts = Post.query.order_by(Post.created_at.desc()).all()
    all_posts = db.session.query(Post).order_by(
        Post.id.desc(),
        Post.created_at.desc(),
        )
    if (limit):
        all_posts = all_posts.limit(limit)
    if (offset):
        all_posts = all_posts.offset(offset)
    return {"Posts": {post.id : post.to_dict() for post in all_posts}}


@post_routes.route("/<int:post_id>")
def get_post_by_id(post_id):
    post = Post.query.get(post_id)

    if not post:
        return {"errors": ["Post not found"]}, 404

    return {"Posts": {post.id : post.to_dict()}}


@post_routes.route("/", methods=["POST"])
@login_required
def create_post():
    author = User.query.get(current_user.id)

    form_data = request.form
    subreddit_id = form_data.get("subreddit_id")
    attachment = request.files.get("attachment")

    subreddit = Subreddit.query.get(subreddit_id)
    upload = {}
    if attachment:
        form = UploadForm()
        form['csrf_token'].data = request.cookies['csrf_token']

        if form.validate_on_submit():
            attachment.filename = get_unique_filename(attachment.filename)
            upload = upload_file_to_s3(attachment)
            if "url" not in upload:
                return {"errors": ["Failed to upload to AWS"]}, 500
        else:
            return {"errors": ["Failed AWS upload validation(s)"]}, 415

    new_post = Post(author=author, subreddit=subreddit, title=form_data.get("title"), content=form_data.get("content"), attachment=upload.get("url"))
    new_vote = PostVote(user=author, post=new_post, vote="upvote")

    try:
        db.session.add(new_post)
        db.session.add(new_vote)
        db.session.commit()
        return new_post.to_dict()
    except:
        return {"errors": ["Something went really wrong..."]}, 500


@post_routes.route("/<int:post_id>", methods=["PUT"])
@login_required
def edit_post_by_id(post_id):
    post = Post.query.get(post_id)
    post_subreddit_owner = post.subreddit.owner.id

    form_data = request.form
    attachment = request.files.get("attachment")
    title = form_data.get("title")
    content = form_data.get("content")
    prev_attachment = post.attachment

    if not post:
        return {"errors": ["Post not found"]}, 404

    if current_user.id == post.user_id or current_user.id == post_subreddit_owner:
        upload = {}

        if attachment:
            form = UploadForm()
            form['csrf_token'].data = request.cookies['csrf_token']

            if form.validate_on_submit():
                attachment.filename = get_unique_filename(attachment.filename)
                upload = upload_file_to_s3(attachment)

                if "url" not in upload:
                    return {"errors": ["Failed to upload to AWS"]}, 500
            else:
                return {"errors": ["Failed AWS upload validation(s)"]}, 415
            post.attachment = upload.get("url")
            try:
                remove_file_from_s3(prev_attachment)
            except:
                print("Failed to remove existing attachment. Probably a seed delete.")

        if title:
            post.title = title
        if content:
            post.content = content

        if form_data.get("attachment") == "null":
            if post.attachment:
                try:
                    remove_file_from_s3(post.attachment)
                except:
                    pass
            post.attachment = None

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
        if post.attachment:
            try:
                remove_file_from_s3(post.attachment)
            except:
                print("Failed to delete from AWS. Probably a seed post delete...")
        db.session.delete(post)
        db.session.commit()
        return {"success": "Successfully deleted"}

    return {"errors": ["Not authorized to perform this delete"]}, 403


@post_routes.route("/<int:post_id>/comments")
def get_all_post_comments(post_id):
    post = Post.query.get(post_id)

    if not post:
        return {"errors": ["Post not found"]}, 404

    return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}

@post_routes.route("<int:post_id>/comments/<int:comment_id>", methods=["DELETE"])
@login_required
def delete_comment(post_id, comment_id):
    post = Post.query.get(post_id)
    comment = Comment.query.get(comment_id)

    try:
        comment.content = "<p><em>[deleted]</em></p>"
        db.session.commit()
        return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}
    except:
        return {"errors": ["Something went wrong..."]}, 500

@post_routes.route("<int:post_id>/comments/<int:comment_id>/votes/<int:vote_id>", methods=["DELETE"])
@login_required
def delete_comment_vote(post_id, comment_id, vote_id):
    post = Post.query.get(post_id)
    vote = CommentVote.query.get(vote_id)
    body = request.get_json()
    user = User.query.get(current_user.id)
    ref_user = User.query.filter(User.username == body.get("refUser")).first()

    try:
        db.session.delete(vote)
        db.session.commit()
        if body.get("IsUserComments") == True:
            return {"Comments": {comment.id: comment.to_shortest_dict() for comment in ref_user.comments}}
        else:
            return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}
    except:
        return {"errors": ["Something went wrong..."]}, 500


@post_routes.route("/<int:post_id>/votes", methods=["POST"])
@login_required
def vote_on_post(post_id):
    body = request.get_json()
    user = User.query.get(current_user.id)
    post = Post.query.get(post_id)

    if not user or not post:
        return {"errors": ["Resource not found"]}, 404

    vote = db.session.query(PostVote)\
        .filter(PostVote.post_id == post_id,
                PostVote.user_id == current_user.id).first()

    if vote and vote.vote == body["vote"]:
        return {"Posts": {post.id : post.to_dict()}}

    new_vote = PostVote(user=user, post=post, vote=body["vote"])
    if not vote:
        try:
            db.session.add(new_vote)
            db.session.commit()
            return {"Posts": {post.id : post.to_dict()}}
        except:
            return {"errors": ["Something went wrong..."]}, 500



    if vote.vote != body["vote"]:
        try:
            db.session.delete(vote)
            db.session.add(new_vote)
            db.session.commit()
            return {"Posts": {post.id : post.to_dict()}}
        except:
            return {"errors": ["Something went wrong..."]}, 500


@post_routes.route("<int:post_id>/votes/<int:vote_id>", methods=["DELETE"])
@login_required
def delete_post_vote(post_id, vote_id):
    post = Post.query.get(post_id)
    vote = PostVote.query.get(vote_id)

    try:
        db.session.delete(vote)
        db.session.commit()
        return {"Posts": {post.id : post.to_dict()}}
    except:
        return {"errors": ["Something went wrong..."]}, 500
