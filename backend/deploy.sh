# Get the SEED_PHRASE
source ~/.bash_profile 

# Build docker
docker kill hardhat-backend
docker rm hardhat-backend

docker build -t hardhat-backend .
docker run -p 8545:8545 -v .:/mnt/ --name hardhat-backend -e SEED_PHRASE hardhat-backend