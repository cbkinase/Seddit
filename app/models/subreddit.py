from sqlalchemy import null
from .db import db, environment, SCHEMA, add_prefix_for_prod
import enum
from random import choice, randint
from faker import Faker
from app.models.categories import categories
import json


# class Categories(enum.Enum):
#     art = "art"
#     entertainment = "entertainment"
#     gaming = "gaming"
#     science = "science"
#     politics = "politics"


class Subreddit(db.Model):

    __tablename__ = "subreddits"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True)
    name = db.Column(db.String, nullable=False, unique=True)
    about = db.Column(db.Text)
    main_pic = db.Column(db.String)
    background_pic = db.Column(db.String)
    category = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    owner = db.relationship("User", back_populates="owns_subreddit")
    subscribers = db.relationship("User", secondary="subreddit_subscribers", back_populates="subreddits")

    @classmethod
    def create(cls, qty, users):
        fake = Faker()
        return [cls(owner = choice(users),
                    name=fake.sentence(nb_words=1),
                    about=fake.sentence(nb_words=randint(20, 200)),
                    main_pic = fake.image(size=(32, 32), image_format="png"),
                    background_pic = fake.image(size=(1000, 200), image_format="png"),
                    category = randint(1, len(categories.keys())))
                    for i in range(qty)]


    def to_dict(self):
        return {
        'id': self.id,
        'owner_id': self.owner_id,
        'name': self.name,
        'about': self.about,
        'main_pic': str(self.main_pic),
        'background_pic': str(self.background_pic),
        'category': categories[self.category],
        'created_at': self.created_at
        }