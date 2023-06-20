from app.models import db, environment, SCHEMA, CommentVote
from sqlalchemy.sql import text


def seed_comment_votes(users, comments, qty=2000):
    users = [user for user in users if user.id != 1]
    dummy_votes = CommentVote.create(qty, users, comments)
    db.session.add_all(dummy_votes)
    db.session.commit()
    return dummy_votes


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_comment_votes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comment_votes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comment_votes"))

    db.session.commit()
