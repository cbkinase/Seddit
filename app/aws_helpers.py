import boto3
import botocore
import os
import uuid

BUCKET_NAME = os.environ.get("S3_BUCKET")
S3_LOCATION = f"https://{BUCKET_NAME}.s3.amazonaws.com/"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "xbm", "tif", "tiff", "pjp", "apng", "svgz", "ico", "svg", "jfif", "webp", "bmp", "pjpeg", "avif"}
BUCKET_FOLDERS = {
    "users": "seddit_users/",
    "posts": "seddit_posts/",
    "subreddits": "seddit_communities/"
}

s3 = boto3.client(
   "s3",
   aws_access_key_id=os.environ.get("S3_KEY"),
   aws_secret_access_key=os.environ.get("S3_SECRET")
)


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


def upload_file_to_s3(file, bucket_folder, acl="public-read"):
    folder_name = BUCKET_FOLDERS[bucket_folder]
    try:
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            f"{folder_name}{file.filename}",
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        return {"errors": str(e)}

    return {"url": f"{S3_LOCATION}{folder_name}{file.filename}"}


def remove_file_from_s3(image_url):
    # AWS needs the image file name, not the URL
    folder = image_url.rsplit("/", 2)[1] + '/'
    file = image_url.rsplit("/", 1)[1]
    key = folder + file
    try:
        s3.delete_object(
        Bucket=BUCKET_NAME,
        Key=key
        )
    except Exception as e:
        return { "errors": str(e) }
    return True
