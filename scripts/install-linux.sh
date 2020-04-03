#!/usr/bin/env bash

echo "Installing dependencies..."

cd ../

# install build tools
sudo apt-get update
sudo apt-get install -y python libpng-dev libjpeg-dev libboost-iostreams-dev \
libboost-system-dev libboost-filesystem-dev libboost-program-options-dev \
build-essential cmake jq wget ncftp s3cmd imagemagick

# install aws CLI
sudo pip install awscli

# install mapcrafter
git clone https://github.com/mapcrafter/mapcrafter.git bin/mapcrafter
cd bin/mapcrafter
cmake .
make
cd ../../

# create .env file
echo "Creating .env file..."
FILE=.env
if [ -f "$FILE" ]; then
    echo "$FILE already exists"
else 
    echo "$FILE does not exist. Creating from default...";
    cp .env.default .env;
    echo "Be sure to fill out $FILE with the correct values before running 'npm start'";
fi

echo "Done!"
