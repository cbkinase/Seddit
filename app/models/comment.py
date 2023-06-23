from .db import db, environment, SCHEMA, add_prefix_for_prod
from random import choice, randint
from faker import Faker


def determine_votes(votes):
    num_upvotes = 0
    num_downvotes = 0
    for vote in votes:
        if vote.vote == "upvote":
            num_upvotes += 1
        elif vote.vote == "downvote":
            num_downvotes += 1
    return num_upvotes - num_downvotes


class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True, index=True)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=True, index=True)
    parent_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("comments.id")), nullable=True, index=True)
    content = db.Column(db.Text, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now())

    children = db.relationship('Comment', back_populates='parent', uselist=True)
    parent = db.relationship('Comment', back_populates='children', remote_side=[id], uselist=False)
    post = db.relationship('Post', back_populates='comments', lazy="select")
    author = db.relationship('User', back_populates='comments')

    votes = db.relationship("CommentVote", back_populates="comment", cascade="all, delete, delete-orphan", lazy="select")


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
                    parent = rand_comment if rand_comment else None)
            comments.append(new_comment)
        return comments


    def to_bare_dict(self):
        # if not self.children:
        #     child_info = None
        # if self.children:
        #     child_info = self.children.to_short_dict()
        votes = self.votes
        return {
            'id': self.id,
            'author_id': self.author.id,
            'author_info': self.author.to_really_short_dict(),
            'post_info': self.post.to_dict(),
            'parent_info': self.parent.to_micro() if self.parent else None,
            'num_replies': len(self.children) if self.children else 0,
            # 'children_info': child_info,
            # 'children_info': {comment.id: comment.to_short_dict() for comment in self.children} if self.children else None,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'upvotes': determine_votes(votes),
            'reaction_info': {vote.user_id: vote.to_dict() for vote in votes}
        }

    def to_micro(self):
        votes = self.votes
        return {
            'id': self.id,
            'author_info': self.author.to_really_short_dict(),
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'post_info': self.post.to_short_dict(),
            'upvotes': determine_votes(votes),
            'reaction_info': {vote.user_id: vote.to_dict() for vote in votes}
        }

    def to_short_dict(self, depth=0):
        votes = self.votes
        return {
            'id': self.id,
            'author_info': self.author.to_really_short_dict(),
            'post_id': self.post.id,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'parent_id': self.parent_id,
            'replies': {reply.id: reply.to_mega_short_dict(depth+1) for reply in self.children} if len(self.children) else None,
            'num_replies': len(self.children) if self.children else 0,
            'depth': depth,
            'upvotes': determine_votes(votes),
            'reaction_info': {vote.user_id: vote.to_dict() for vote in votes}
        }

    def to_mega_short_dict(self, depth):
        votes = self.votes
        return {
            'id': self.id,
            'author_info': self.author.to_really_short_dict(),
            'content': self.content,
            'created_at': self.created_at,
            'depth': depth,
            'replies': {reply.id: reply.to_mega_short_dict(depth + 1) for reply in self.children} if len(self.children) else None,
            'num_replies': len(self.children) if self.children else 0,
            'upvotes': determine_votes(votes),
            'reaction_info': {vote.user_id: vote.to_dict() for vote in votes}
        }

    def to_shortest_dict(self):
        votes = self.votes
        return {
            'id': self.id,
            'author_id': self.author.id,
            'author_info': self.author.to_really_short_dict(),
            'post_info': self.post.to_shortest_dict(),
            # 'parent_info': self.parent.to_micro() if self.parent else None,
            # 'num_replies': len(self.children) if self.children else 0,
            # 'children_info': child_info,
            # 'children_info': {comment.id: comment.to_short_dict() for comment in self.children} if self.children else None,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'upvotes': determine_votes(votes),
            'reaction_info': {vote.user_id: vote.to_dict() for vote in votes}
            }
