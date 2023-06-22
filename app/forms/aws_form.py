from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField
from ..aws_helpers import ALLOWED_EXTENSIONS

def create_upload_form(field_name):
    """Factory for creating UploadForms with needed attrs"""
    class UploadForm(FlaskForm):
        if field_name == "attachment":
            attachment = FileField("attachment", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
        if field_name == "avatar":
            avatar = FileField("avatar", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
        submit = SubmitField("Create")

    return UploadForm()
