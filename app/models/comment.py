from .db import db, environment, SCHEMA, add_prefix_for_prod
from random import choice, randint
from faker import Faker


class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("comments.id")), nullable=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    children = db.relationship('Comment', back_populates='parent', uselist=True)
    parent = db.relationship('Comment', back_populates='children', remote_side=[id], uselist=False)
    post = db.relationship('Post', back_populates='comments')
    author = db.relationship('User', back_populates='comments')


    @classmethod
    def create(cls, qty, users, posts):
        fake = Faker()
        comments = []
        for i in range(qty):
            rand_post = choice(posts)
            rand_comment = choice(rand_post.comments) if (len(comments) > 0 and randint(0, 1) and len(rand_post.comments)) else None
            new_comment = cls(author=choice(users),
                    post=rand_post,
                    content = fake.sentence(nb_words = randint(3, 70)),
                    parent = rand_comment)
            comments.append(new_comment)
        return comments


    def to_bare_dict(self):
        # if not self.children:
        #     child_info = None
        # if self.children:
        #     child_info = self.children.to_short_dict()
        return {
            'id': self.id,
            'author_id': self.author.id,
            'post_info': self.post.to_dict(),
            'parent_info': self.parent.to_micro() if self.parent else None,
            'num_replies': len(self.children) if self.children else 0,
            # 'children_info': child_info,
            # 'children_info': {comment.id: comment.to_short_dict() for comment in self.children} if self.children else None,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def to_micro(self):
        return {
            'id': self.id,
            'author_info': self.author.to_short_dict(),
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'post_info': self.post.to_short_dict(),
        }

    def to_short_dict(self, depth=0):
        return {
            'id': self.id,
            'author_info': self.author.to_short_dict(),
            'post_id': self.post.id,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'parent_id': self.parent_id,
            'replies': {reply.id: reply.to_mega_short_dict(depth+1) for reply in self.children} if len(self.children) else None,
            'num_replies': len(self.children) if self.children else 0,
            'depth': depth,
        }

    def to_mega_short_dict(self, depth):
        return {
            'id': self.id,
            'author_info': self.author.to_short_dict(),
            'content': self.content,
            'created_at': self.created_at,
            'depth': depth,
            'replies': {reply.id: reply.to_mega_short_dict(depth + 1) for reply in self.children} if len(self.children) else None,
            'num_replies': len(self.children) if self.children else 0,

        }
