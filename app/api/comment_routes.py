from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Subreddit, Post, Comment, db, CommentVote


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


@comment_routes.route("/<int:comment_id>/votes", methods=["POST"])
@login_required
def vote_on_comment(comment_id):
    body = request.get_json()
    comment = Comment.query.get(comment_id)
    user = User.query.get(current_user.id)
    post = Post.query.get(body.get("post_id"))
    ref_user = User.query.filter(User.username == body.get("refUser")).first()

    if not user or not comment:
        return {"errors": ["Resource not found"]}, 404

    vote = db.session.query(CommentVote)\
        .filter(CommentVote.comment_id == comment_id,
                CommentVote.user_id == current_user.id).first()

    new_vote = CommentVote(user=user, comment=comment, vote=body["vote"])
    if not vote:
        try:
            db.session.add(new_vote)
            db.session.commit()

            if body.get("IsUserComments"):
                return {"Comments": {comment.id: comment.to_shortest_dict() for comment in ref_user.comments}}
            else:
                return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}

        except:
            if body.get("IsUserComments"):
                return {"Comments": {comment.id: comment.to_shortest_dict() for comment in ref_user.comments}}
            else:
                return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}

    if vote.vote == body["vote"]:
        return {"errors": ["Already voted "]}

    if vote.vote != body["vote"]:
        try:
            db.session.delete(vote)
            db.session.add(new_vote)
            db.session.commit()
            if body.get("IsUserComments"):
                return {"Comments": {comment.id: comment.to_shortest_dict() for comment in ref_user.comments}}
            else:
                return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}
        except:
            if body.get("IsUserComments"):
                return {"Comments": {comment.id: comment.to_shortest_dict() for comment in ref_user.comments}}
            else:
                return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}
