rm -r nginx/build
rm -r frontend/build

source ~/.bash_profile

cd frontend
docker build . -t frontend-build
docker run -v $(pwd)/build:/opt/build frontend-build
cp -r build ../nginx
cd ..

docker compose build --no-cache
docker compose up
