from .db import db, environment, SCHEMA, add_prefix_for_prod


subreddit_subscribers = db.Table(
    "subreddit_subscribers",
    db.Model.metadata,
    db.Column("user_id", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("subreddit_id", db.Integer, db.ForeignKey(add_prefix_for_prod("subreddits.id")), primary_key=True)
)


if environment == "production":
    subreddit_subscribers.schema = SCHEMA