from .db import db, environment, SCHEMA, add_prefix_for_prod
from random import choice

class PostVote(db.Model):
    __tablename__ = 'post_votes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")))
    vote = db.Column(db.String, nullable=False)

    user = db.relationship("User", back_populates="post_votes")
    post = db.relationship("Post", back_populates="votes")

    @classmethod
    def create(cls, qty, users, posts):
        vote_options = ["upvote", "downvote", "upvote", "upvote", "upvote", "upvote", "upvote", "upvote", "upvote"] # seed more upvotes than downvotes
        return [cls(
            user=choice(users),
            post=choice(posts),
            vote=choice(vote_options) ) for _ in range(qty)]

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'vote': self.vote,
        }
