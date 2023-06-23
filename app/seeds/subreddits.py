from app.models import db, Subreddit, environment, SCHEMA
from sqlalchemy.sql import text
from random import sample, randint


def seed_subreddits(users, qty=15):
    dummy_subreddits = Subreddit.create(qty, users)

    for subreddit in dummy_subreddits:
        new_subs = sample(users, randint(2, len(users)))
        for sub in new_subs:
            subreddit.subscribers.append(sub)

    db.session.add_all(dummy_subreddits)
    db.session.commit()

    return dummy_subreddits


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_subreddits():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.subreddits RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM subreddits"))

    db.session.commit()
