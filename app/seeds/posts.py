from app.models import db, Post, environment, SCHEMA
from sqlalchemy.sql import text


def seed_posts(users, subreddits):
    dummy_posts = Post.create(20, users, subreddits)

    for post in dummy_posts:
        db.session.add(post)

    db.session.commit()


    db.session.commit()

    return dummy_posts


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.subreddits RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM subreddits"))

    db.session.commit()