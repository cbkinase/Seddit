from .db import db, environment, SCHEMA, add_prefix_for_prod
from random import choices

class PostVote(db.Model):
    __tablename__ = 'post_votes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), index=True)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), index=True)
    vote = db.Column(db.String, nullable=False)

    user = db.relationship("User", back_populates="post_votes")
    post = db.relationship("Post", back_populates="votes", lazy="select")

    @classmethod
    def create(cls, qty, users, posts):
        vote_options = ["upvote", "downvote", "upvote", "upvote", "upvote", "upvote", "upvote", "upvote", "upvote"] # seed more upvotes than downvotes

        user_choices = choices(users, k=qty)
        post_choices = choices(posts, k=qty)
        vote_choices = choices(vote_options, k=qty)

        return [cls(user_id=user.id, post_id=post.id, vote=vote) for user, post, vote in zip(user_choices, post_choices, vote_choices)]

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'vote': self.vote,
        }
