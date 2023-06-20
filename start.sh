# Assumes you are using pyenv 3.9.4 and Node 16.17.1

source_file=".env.example"
destination_file=".env"
be_directory=".venv"
fe_directory="frontend/node_modules"

# Create .env if it doesn't exist

if [ ! -f "$destination_file" ]; then
    # Copy the contents of .env.example into .env
    cat "$source_file" > "$destination_file"
    echo "Contents of $source_file copied to $destination_file"
else
    echo "File $destination_file already exists"
fi


# Check if .venv exists: install backend dependencies & db if not

if [ ! -d "$be_directory" ]; then
    echo "Installing backend dependencies and creating/seeding database. This may take a few minutes."
    pipenv install -r requirements.txt && pipenv run flask db upgrade && pipenv run flask seed all
else
    echo "Starting up Seddit!!!"
fi


# Check if the directory exists

if [ ! -d "$fe_directory" ]; then
    echo "Directory does not exist: $fe_directory"
    echo "Installing frontend dependencies. This may take some time."
    cd frontend
    npm install
else
    echo "Directory exists: $fe_directory"
fi

cd frontend

# Spawn processes in a subshell and trap SIGINT to kill 0
# (See https://stackoverflow.com/a/52033580 for more)

(trap 'kill 0' SIGINT; npm start & cd .. && pipenv run flask run & wait)
