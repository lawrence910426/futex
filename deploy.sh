rm -r nginx/build

source ~/.bash_profile

cd frontend
docker build . -t frontend-build
docker run -v $(pwd)/build:/app/build frontend-build
cp -r build ../nginx
cd ..

docker compose build --no-cache
docker compose up
