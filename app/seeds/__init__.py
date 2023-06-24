from flask.cli import AppGroup
from .users import seed_users, undo_users
from .subreddits import seed_subreddits, undo_subreddits
from .posts import seed_posts, undo_posts
from .comments import seed_comments, undo_comments
from .comment_votes import seed_comment_votes, undo_comment_votes
from .post_votes import seed_post_votes, undo_post_votes
from app.models.db import db, environment, SCHEMA
import datetime

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

    prod_env_val = 'production' # change this from 'production' to seed a lot

    base_posts = 300
    base_comments = 4500
    base_pv = 10_000
    base_cv = 100_000
    scaling_factor = 1

    num_users = 30 if environment == prod_env_val else 30
    num_subreddits = 15 if environment == prod_env_val else 15
    num_posts = base_posts if environment == prod_env_val else base_posts * scaling_factor
    num_comments = base_comments if environment == prod_env_val else base_comments * scaling_factor
    num_post_votes = base_pv if environment == prod_env_val else base_pv * scaling_factor
    num_comment_votes = base_cv if environment == prod_env_val else base_cv * scaling_factor

    users = seed_users(num_users)
    subreddits = seed_subreddits(users, num_subreddits)
    posts = seed_posts(users, subreddits, num_posts)
    comments = seed_comments(users, posts, num_comments)
    seed_post_votes(users, posts, num_post_votes)

    if environment == "production":
        seed_comment_votes(users, comments, num_comment_votes)
    else:
        seed_comment_votes(users, comments, num_comment_votes)

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
