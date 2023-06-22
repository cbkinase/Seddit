rm instance/dev.db
pipenv run flask db upgrade
pipenv run flask seed all
