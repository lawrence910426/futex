# Futex

# Development Guide

## Start the Local Ethereum Development Server

Before you start, reset your location to the root directory of this repository.

1. Set your mnemonic phrase into the environment variable `SEED_PHRASE` and put it into `~/.bash_profile`:
```bash
export SEED_PHRASE="your mnemonic phrase here"
```

2. Prepare a docker environment [Reference](https://docs.docker.com/guides/getting-started/get-docker-desktop/)

3. Navigate to the backend directory with `cd backend` and run the deployment script:
```bash
bash deploy.sh
```

4. After deployment, fill in the `TOKEN_ADDRESS` and `CONTRACT_ADDRESS` in `config.development.json` using the terminal output.

5. Last, connect your metamask (or whatever you are using) to your local network. [Reference](https://docs.metamask.io/wallet/how-to/run-devnet/)

### Restarting the Ethereum Development Server

Kill the current session and restart with `bash deploy.sh` and clear the nonce in MetaMask.

## Start the React.js Development Server

Before you start, reset your location to the root directory of this repository.

1. Navigate to the frontend directory and install dependencies:
```bash
cd frontend && npm install
```

2. Start the React.js development server:
```bash
npm run start
```

### Restarting the React.js Development Environment

If you need to restart the React.js development environment, stop the current server by pressing `Ctrl+C` and then start it again:
```bash
npm run start
```

# Run a production ready instance

Put the environment variables to your `~/.bash_profile`
```
export MYSQL_ROOT_PASSWORD=somewordpress
export MYSQL_DATABASE=wordpress
export MYSQL_USER=wordpress
export MYSQL_PASSWORD=wordpress
export WORDPRESS_DB_USER=wordpress
export WORDPRESS_DB_PASSWORD=wordpress
export WORDPRESS_DB_NAME=wordpress
```

And then, run `bash deploy.sh`.
