#!/bin/bash

rm -r nginx/build

source ~/.bash_profile

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

# Determine if the script is running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS sed command
    sed -i '' "s/${placeholder}/${replacement}/g" nginx/nginx.conf
else
    # Linux sed command
    sed -i "s/${placeholder}/${replacement}/g" nginx/nginx.conf
fi

docker compose build --no-cache
docker compose up