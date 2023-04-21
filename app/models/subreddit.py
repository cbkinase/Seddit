from sqlalchemy import null
from .db import db, environment, SCHEMA, add_prefix_for_prod
import enum
from random import choice, randint
from faker import Faker
from app.models.categories import categories
import json
from .user import User


# class Categories(enum.Enum):
#     art = "art"
#     entertainment = "entertainment"
#     gaming = "gaming"
#     science = "science"
#     politics = "politics"
cat_info = [{"id":"49p","url":"https://cdn2.thecatapi.com/images/49p.gif","width":350,"height":180},{"id":"5qj","url":"https://cdn2.thecatapi.com/images/5qj.jpg","width":480,"height":360},{"id":"6dt","url":"https://cdn2.thecatapi.com/images/6dt.jpg","width":800,"height":600},{"id":"b6f","url":"https://cdn2.thecatapi.com/images/b6f.jpg","width":500,"height":661},{"id":"cc4","url":"https://cdn2.thecatapi.com/images/cc4.jpg","width":795,"height":744},{"id":"cd4","url":"https://cdn2.thecatapi.com/images/cd4.jpg","width":600,"height":434},{"id":"dhj","url":"https://cdn2.thecatapi.com/images/dhj.jpg","width":1037,"height":692},{"id":"MTY1MjM4OA","url":"https://cdn2.thecatapi.com/images/MTY1MjM4OA.jpg","width":500,"height":313},{"id":"njK25knLH","url":"https://cdn2.thecatapi.com/images/njK25knLH.jpg","width":1024,"height":823},{"id":"nHrt_0PV3","url":"https://cdn2.thecatapi.com/images/nHrt_0PV3.jpg","width":750,"height":777},{"id":"63","url":"https://cdn2.thecatapi.com/images/63.gif","width":489,"height":400},{"id":"2ke","url":"https://cdn2.thecatapi.com/images/2ke.jpg","width":500,"height":333},{"id":"4pd","url":"https://cdn2.thecatapi.com/images/4pd.gif","width":490,"height":368},{"id":"7d8","url":"https://cdn2.thecatapi.com/images/7d8.jpg","width":500,"height":370},{"id":"a4h","url":"https://cdn2.thecatapi.com/images/a4h.jpg","width":489,"height":500},{"id":"acr","url":"https://cdn2.thecatapi.com/images/acr.jpg","width":1200,"height":798},{"id":"dim","url":"https://cdn2.thecatapi.com/images/dim.jpg","width":640,"height":427},{"id":"MTc4OTE4NQ","url":"https://cdn2.thecatapi.com/images/MTc4OTE4NQ.jpg","width":303,"height":400},{"id":"MTkzMzc1NA","url":"https://cdn2.thecatapi.com/images/MTkzMzc1NA.jpg","width":1000,"height":750},{"id":"MjA2NDA1Mg","url":"https://cdn2.thecatapi.com/images/MjA2NDA1Mg.jpg","width":500,"height":382},{"id":"1f1","url":"https://cdn2.thecatapi.com/images/1f1.jpg","width":612,"height":612},{"id":"2d6","url":"https://cdn2.thecatapi.com/images/2d6.jpg","width":500,"height":333},{"id":"5kr","url":"https://cdn2.thecatapi.com/images/5kr.jpg","width":479,"height":364},{"id":"62f","url":"https://cdn2.thecatapi.com/images/62f.jpg","width":2304,"height":3072},{"id":"cej","url":"https://cdn2.thecatapi.com/images/cej.jpg","width":640,"height":427},{"id":"dbe","url":"https://cdn2.thecatapi.com/images/dbe.gif","width":250,"height":170},{"id":"ei4","url":"https://cdn2.thecatapi.com/images/ei4.jpg","width":500,"height":372},{"id":"MTU1MDA0NA","url":"https://cdn2.thecatapi.com/images/MTU1MDA0NA.jpg","width":640,"height":531},{"id":"MTk1NjM4MA","url":"https://cdn2.thecatapi.com/images/MTk1NjM4MA.jpg","width":500,"height":375},{"id":"106hayhS4","url":"https://cdn2.thecatapi.com/images/106hayhS4.jpg","width":1600,"height":1303}]

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
        filtered_cat_pics = [pic['url'] for pic in cat_info if pic['url'].endswith("jpg")]
        return [cls(owner = choice(users),
                    name=fake.unique.word(),
                    about=fake.sentence(nb_words=randint(20, 200)),
                    main_pic = choice(filtered_cat_pics),
                    background_pic = choice(filtered_cat_pics),
                    # main_pic = fake.image(size=(32, 32), image_format="png"),
                    # background_pic = fake.image(size=(1000, 200), image_format="png"),
                    category = randint(1, len(categories.keys())))
                    for i in range(qty)]


    def to_dict(self):
        subreddit_owner = User.query.get(self.owner_id)
        category = categories.get(self.category)
        print(self.category)
        return {
        'id': self.id,
        'owner_id': self.owner_id,
        'name': self.name,
        'about': self.about,
        'main_pic': str(self.main_pic),
        'background_pic': str(self.background_pic),
        'category': category,
        'created_at': self.created_at,
        'owner_info': subreddit_owner.to_dict(),
        'subscribers': {sub.id : sub.to_dict() for sub in self.subscribers},
        "numSubscribers": len(self.subscribers)
        }
