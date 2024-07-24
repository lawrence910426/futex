rm -r nginx/build

source ~/.bash_profile

cd frontend
npm install
npm run build
cp -r build ../nginx

docker compose build --no-cache
docker compose up
