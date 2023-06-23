from flask.cli import AppGroup
from .users import seed_users, undo_users
from .subreddits import seed_subreddits, undo_subreddits
from .posts import seed_posts, undo_posts
from .comments import seed_comments, undo_comments
from .comment_votes import seed_comment_votes, undo_comment_votes
from .post_votes import seed_post_votes, undo_post_votes

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_comment_votes()
        undo_post_votes()
        undo_comments()
        undo_posts()
        undo_subreddits()
        undo_users()

    users = seed_users(50)
    subreddits = seed_subreddits(users, 50)
    posts = seed_posts(users, subreddits, 500)
    comments = seed_comments(users, posts, 5000)
    post_votes = seed_post_votes(users, posts, 10_000)
    if environment == "production":
        comment_votes = seed_comment_votes(users, comments, 100_000)
    else:
        comment_votes = seed_comment_votes(users, comments, 100_000)

    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_comment_votes()
    undo_post_votes()
    undo_comments()
    undo_posts()
    undo_subreddits()
    undo_users()

    # Add other undo functions here
