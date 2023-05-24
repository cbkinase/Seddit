from .db import db, environment, SCHEMA, add_prefix_for_prod
from random import choice

class CommentVote(db.Model):
    __tablename__ = 'comment_votes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    comment_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("comments.id")))
    vote = db.Column(db.String, nullable=False)

    user = db.relationship("User", back_populates="comment_votes")
    comment = db.relationship("Comment", back_populates="votes")

    @classmethod
    def create(cls, qty, users, comments):
        vote_options = ["upvote", "downvote", "upvote", "upvote", "upvote", "upvote", "upvote", "upvote", "upvote"] # seed more upvotes than downvotes
        return [cls(
            user=choice(users),
            comment=choice(comments),
            vote=choice(vote_options) ) for _ in range(qty)]


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'comment_id': self.comment_id,
            'vote': self.vote,
        }
