from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from faker import Faker


class User(db.Model, UserMixin):

    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.String(255), default="https://www.redditstatic.com/avatars/avatar_default_02_A5A4A4.png")
    bio = db.Column(db.String(2000))
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    owns_subreddit = db.relationship("Subreddit", back_populates="owner")
    subreddits = db.relationship("Subreddit", secondary="subreddit_subscribers", back_populates="subscribers")
    posts = db.relationship("Post", back_populates="author")

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
            'subreddits': {sub.name : sub.to_short_dict() for sub in self.subreddits}
        }

    def to_short_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'avatar': self.avatar,
            'bio': self.bio,
            'created_at': self.created_at,
            'num_posts': len(self.posts)
        }
