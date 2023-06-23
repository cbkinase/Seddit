from .db import db, environment, SCHEMA, add_prefix_for_prod
from random import choice, randint
from faker import Faker
from sqlalchemy.orm import joinedload


def get_post_with_votes(post_id):
    post = db.session.query(Post).options(joinedload(Post.votes)).get(post_id)
    return post


def determine_votes(votes):
    num_upvotes = 0
    num_downvotes = 0
    for vote in votes:
        if vote.vote == "upvote":
            num_upvotes += 1
        elif vote.vote == "downvote":
            num_downvotes += 1
    return num_upvotes - num_downvotes


cat_info = [{"id":"49p","url":"https://cdn2.thecatapi.com/images/49p.gif","width":350,"height":180},{"id":"5qj","url":"https://cdn2.thecatapi.com/images/5qj.jpg","width":480,"height":360},{"id":"6dt","url":"https://cdn2.thecatapi.com/images/6dt.jpg","width":800,"height":600},{"id":"b6f","url":"https://cdn2.thecatapi.com/images/b6f.jpg","width":500,"height":661},{"id":"cc4","url":"https://cdn2.thecatapi.com/images/cc4.jpg","width":795,"height":744},{"id":"cd4","url":"https://cdn2.thecatapi.com/images/cd4.jpg","width":600,"height":434},{"id":"dhj","url":"https://cdn2.thecatapi.com/images/dhj.jpg","width":1037,"height":692},{"id":"MTY1MjM4OA","url":"https://cdn2.thecatapi.com/images/MTY1MjM4OA.jpg","width":500,"height":313},{"id":"njK25knLH","url":"https://cdn2.thecatapi.com/images/njK25knLH.jpg","width":1024,"height":823},{"id":"nHrt_0PV3","url":"https://cdn2.thecatapi.com/images/nHrt_0PV3.jpg","width":750,"height":777},{"id":"63","url":"https://cdn2.thecatapi.com/images/63.gif","width":489,"height":400},{"id":"2ke","url":"https://cdn2.thecatapi.com/images/2ke.jpg","width":500,"height":333},{"id":"4pd","url":"https://cdn2.thecatapi.com/images/4pd.gif","width":490,"height":368},{"id":"7d8","url":"https://cdn2.thecatapi.com/images/7d8.jpg","width":500,"height":370},{"id":"a4h","url":"https://cdn2.thecatapi.com/images/a4h.jpg","width":489,"height":500},{"id":"acr","url":"https://cdn2.thecatapi.com/images/acr.jpg","width":1200,"height":798},{"id":"dim","url":"https://cdn2.thecatapi.com/images/dim.jpg","width":640,"height":427},{"id":"MTc4OTE4NQ","url":"https://cdn2.thecatapi.com/images/MTc4OTE4NQ.jpg","width":303,"height":400},{"id":"MTkzMzc1NA","url":"https://cdn2.thecatapi.com/images/MTkzMzc1NA.jpg","width":1000,"height":750},{"id":"MjA2NDA1Mg","url":"https://cdn2.thecatapi.com/images/MjA2NDA1Mg.jpg","width":500,"height":382},{"id":"1f1","url":"https://cdn2.thecatapi.com/images/1f1.jpg","width":612,"height":612},{"id":"2d6","url":"https://cdn2.thecatapi.com/images/2d6.jpg","width":500,"height":333},{"id":"5kr","url":"https://cdn2.thecatapi.com/images/5kr.jpg","width":479,"height":364},{"id":"62f","url":"https://cdn2.thecatapi.com/images/62f.jpg","width":2304,"height":3072},{"id":"cej","url":"https://cdn2.thecatapi.com/images/cej.jpg","width":640,"height":427},{"id":"dbe","url":"https://cdn2.thecatapi.com/images/dbe.gif","width":250,"height":170},{"id":"ei4","url":"https://cdn2.thecatapi.com/images/ei4.jpg","width":500,"height":372},{"id":"MTU1MDA0NA","url":"https://cdn2.thecatapi.com/images/MTU1MDA0NA.jpg","width":640,"height":531},{"id":"MTk1NjM4MA","url":"https://cdn2.thecatapi.com/images/MTk1NjM4MA.jpg","width":500,"height":375},{"id":"106hayhS4","url":"https://cdn2.thecatapi.com/images/106hayhS4.jpg","width":1600,"height":1303}]

class Post(db.Model):
    __tablename__ = "posts"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True, index=True)
    subreddit_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("subreddits.id")), nullable=True, index=True)
    title = db.Column(db.String, index=True)
    content = db.Column(db.Text, index=True)
    attachment = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    author = db.relationship("User", back_populates="posts")
    subreddit = db.relationship("Subreddit", back_populates="posts")

    comments = db.relationship('Comment', back_populates='post', cascade='delete', lazy="select")

    votes = db.relationship("PostVote", back_populates="post", cascade="all, delete, delete-orphan", lazy="select")


    @classmethod
    def create(cls, qty, users, subreddits):
        fake = Faker()
        filtered_cat_pics = [pic['url'] for pic in cat_info if pic['url'].endswith("jpg")]
        return [cls(subreddit_id = choice(subreddits).id,
                    user_id = choice(users).id,
                    title = fake.sentence(nb_words = randint(3, 25)),
                    content = fake.sentence(nb_words = randint(3, 70)),
                    attachment = choice(filtered_cat_pics))
                    for _ in range(qty)]


    def to_dict(self):
        return {
            'id': self.id,
            'author_info': self.author.to_really_short_dict(),
            'subreddit_info': self.subreddit.to_short_dict(),
            'title': self.title,
            'content': self.content,
            'attachment': self.attachment,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'num_comments': len(self.comments),
            'upvotes': determine_votes(self.votes),
            'reaction_info': {vote.user_id: vote.to_dict() for vote in self.votes},
        }

    def to_short_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subreddit_id': self.subreddit_id,
            'title': self.title,
            'content': self.content,
            'attachment': self.attachment,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'num_comments': len(self.comments),
            'upvotes': determine_votes(self.votes),
            'reaction_info': {vote.user_id: vote.to_dict() for vote in self.votes},
        }

    def to_shortest_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subreddit_id': self.subreddit_id,
            'title': self.title,
            'content': self.content,
            'attachment': self.attachment,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'author_info': self.author.to_really_short_dict(),
            'subreddit_info': self.subreddit.to_short_dict(),
            # 'num_comments': len(self.comments),
            # 'upvotes': determine_votes(self.votes),
            # 'reaction_info': {vote.user_id: vote.to_dict() for vote in self.votes},
        }
