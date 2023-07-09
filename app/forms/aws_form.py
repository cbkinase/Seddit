from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField
from ..aws_helpers import ALLOWED_EXTENSIONS


def create_upload_form(field_name):
    """Factory for creating UploadForms with needed attrs"""
    allowable_field_types = ["attachment", "avatar", "main_pic"]

    if field_name not in allowable_field_types:
        raise ValueError(f"Invalid field name '{field_name}'. Valid options are: {', '.join(allowable_field_types)}.")

    class UploadForm(FlaskForm):
        validators = [FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))]
        temp_field = FileField(field_name, validators=validators)
        submit = SubmitField("Create")

    setattr(UploadForm, field_name, UploadForm.temp_field)
    delattr(UploadForm, 'temp_field')
    return UploadForm()
