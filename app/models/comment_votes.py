from .db import db, environment, SCHEMA, add_prefix_for_prod
from random import choices


class CommentVote(db.Model):
    __tablename__ = 'comment_votes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), index=True)
    comment_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("comments.id")), index=True)
    vote = db.Column(db.String, nullable=False)

    user = db.relationship("User", back_populates="comment_votes")
    comment = db.relationship("Comment", back_populates="votes", lazy="select")

    @classmethod
    def create(cls, qty, users, comments):
        vote_options = ["upvote", "downvote", "upvote", "upvote", "upvote", "upvote", "upvote", "upvote", "upvote"] # seed more upvotes than downvotes

        # pre-generate all random selections
        user_choices = choices(users, k=qty)
        comment_choices = choices(comments, k=qty)
        vote_choices = choices(vote_options, k=qty)

        # defer creation of associations until later
        # to improve seeding performance
        comment_votes = [cls(user_id=user.id, comment_id=comment.id, vote=vote) for user, comment, vote in zip(user_choices, comment_choices, vote_choices)]

        return comment_votes


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'comment_id': self.comment_id,
            'vote': self.vote,
        }
