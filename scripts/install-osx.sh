#!/usr/bin/env bash

echo "Installing dependencies..."

cd ../

# install homebrew if missing or update it
which -s brew
if [[ $? != 0 ]] ; then
    echo "Homebrew not found. Installing it..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
else
    echo "Homebrew found. Updating it..."
    brew update
fi

# install build tools
brew install cmake s3cmd python3
sudo easy_install pip

cd bin

# install pillow
echo "Installing pillow"

python3 -m pip install numpy pillow
#curl "https://codeload.github.com/python-pillow/Pillow/tar.gz/7.1.1" -o "pillow.tar.gz"
mkdir "pillow"
tar -xvf "pillow.tar.gz" -C "pillow" --strip-components 1
rm "pillow.tar.gz"

# install aws CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# install overviewer
echo "Installing overviewer"

curl "https://overviewer.org/builds/overviewer-latest.tar.gz" -o "overviewer-latest.tar.gz"
mkdir "overviewer"
tar -xvf "overviewer-latest.tar.gz" -C "overviewer" --strip-components 1
rm "overviewer-latest.tar.gz"
cp "pillow/src/libImaging/Imaging.h" "overviewer"
cp "pillow/src/libImaging/ImagingUtils.h" "overviewer"
cp "pillow/src/libImaging/ImPlatform.h" "overviewer"
cd overviewer
python3 setup.py build
cd ../../

# copy custom icons to overviewer
cp icons/*.png bin/overviewer/overviewer_core/data/web_assets/icons

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