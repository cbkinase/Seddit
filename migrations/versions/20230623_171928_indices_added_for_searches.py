"""indices added for searches

Revision ID: 930c8d8866bb
Revises: 92494aff6b58
Create Date: 2023-06-23 17:19:28.740663

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '930c8d8866bb'
down_revision = '92494aff6b58'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_comments_content'), ['content'], unique=False)

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_posts_content'), ['content'], unique=False)
        batch_op.create_index(batch_op.f('ix_posts_title'), ['title'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_posts_title'))
        batch_op.drop_index(batch_op.f('ix_posts_content'))

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_comments_content'))

    # ### end Alembic commands ###