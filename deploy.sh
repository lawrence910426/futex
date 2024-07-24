#!/bin/bash

rm -r nginx/build
rm -r frontend/build

source ~/.bash_profile

cd frontend
docker build . -t frontend-build
docker run -v $(pwd)/build:/opt/build frontend-build
cp -r build ../nginx
cd ..

placeholder="\$is_behind_cloudflare"

if [[ "$1" == "--cloudflare" ]]; then
    replacement="https"
    echo "Enabled Cloudflare. Updating nginx.conf..."
else
    replacement="\$scheme"
    echo "Enabled Cloudflare. Updating nginx.conf..."
fi

rm nginx/nginx.conf
cp nginx/nginx.conf.template nginx/nginx.conf
awk -v placeholder="${placeholder}" -v replacement="${replacement}" '{gsub(placeholder, replacement); print}' nginx/nginx.conf.template > nginx/nginx.conf

docker compose build --no-cache
docker compose up