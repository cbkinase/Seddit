from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from faker import Faker
from app.models.post import Post
from app.models.comment import Comment
from app.models.post_votes import PostVote
from app.models.comment_votes import CommentVote
from sqlalchemy.sql import func


def determineKarma(user_id):
    # Get ids of posts and comments made by user
    post_ids = db.session.query(Post.id).filter(Post.user_id == user_id).subquery()
    comment_ids = db.session.query(Comment.id).filter(Comment.user_id == user_id).subquery()

    # Get votes on those posts and comments
    post_upvotes = db.session.query(func.count(PostVote.id)).filter(PostVote.post_id.in_(post_ids), PostVote.vote == "upvote").scalar()
    post_downvotes = db.session.query(func.count(PostVote.id)).filter(PostVote.post_id.in_(post_ids), PostVote.vote == "downvote").scalar()

    comment_upvotes = db.session.query(func.count(CommentVote.id)).filter(CommentVote.comment_id.in_(comment_ids), CommentVote.vote == "upvote").scalar()
    comment_downvotes = db.session.query(func.count(CommentVote.id)).filter(CommentVote.comment_id.in_(comment_ids), CommentVote.vote == "downvote").scalar()

    post_upvotes = post_upvotes if post_upvotes is not None else 0
    post_downvotes = post_downvotes if post_downvotes is not None else 0
    comment_upvotes = comment_upvotes if comment_upvotes is not None else 0
    comment_downvotes = comment_downvotes if comment_downvotes is not None else 0

    total_karma = (post_upvotes - post_downvotes) + (comment_upvotes - comment_downvotes)
    return total_karma


class User(db.Model, UserMixin):

    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True, index=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.String(255), default="https://www.redditstatic.com/avatars/avatar_default_02_A5A4A4.png")
    bio = db.Column(db.String(2000))
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    owns_subreddit = db.relationship("Subreddit", back_populates="owner")
    subreddits = db.relationship("Subreddit", secondary="subreddit_subscribers", back_populates="subscribers")

    posts = db.relationship("Post", back_populates="author")
    comments = db.relationship('Comment', back_populates='author')

    post_votes = db.relationship("PostVote", back_populates="user")
    comment_votes = db.relationship("CommentVote", back_populates="user")

    @classmethod
    def create(cls, qty):
        fake = Faker()
        profile_data = [fake.profile() for i in range(qty)]
        new_users = [cls(username=user['username'], email=user['mail'], password="password", bio=fake.paragraph()) for user in profile_data]
        return new_users


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)



    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'avatar': self.avatar,
            'bio': self.bio,
            'created_at': self.created_at,
            'num_posts': len(self.posts),
            'num_comments': len(self.comments),
            'subreddits': {sub.name : sub.to_short_dict() for sub in self.subreddits},
            'karma': determineKarma(self.id),
        }

    def to_short_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'avatar': self.avatar,
            'bio': self.bio,
            'created_at': self.created_at,
            'num_posts': len(self.posts),
            'num_comments': len(self.comments),
            'karma': determineKarma(self.id),
        }

    def to_really_short_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'avatar': self.avatar,
            'bio': self.bio,
            'created_at': self.created_at,
        }
