from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField
from ..aws_helpers import ALLOWED_EXTENSIONS


class UploadForm(FlaskForm):
    attachment = FileField("attachment", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    submit = SubmitField("Create")
