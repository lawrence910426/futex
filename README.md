Here is the fluent development guide for Futex:

# Futex

# Development Guide

## Start the Local Ethereum Development Server

Before you start, reset your location to the root directory of this repository.

1. Set your mnemonic phrase into the environment variable `SEED_PHRASE`:
```bash
export SEED_PHRASE="your mnemonic phrase here"
```

2. Navigate to the backend directory and install dependencies:
```bash
cd backend && npm install
```

3. Navigate to the scripts directory and run the deployment script:
```bash
cd scripts && bash deploy.sh
```

4. After deployment, fill in the `TOKEN_ADDRESS` and `CONTRACT_ADDRESS` in `config.development.json` using the terminal output.

5. Last, connect your metamask (or whatever you are using) to your local network. [Reference](https://docs.metamask.io/wallet/how-to/run-devnet/)

### Restarting the Ethereum Development Server

If you need to restart the Ethereum development server:

1. Attach to the existing tmux session:
```bash
tmux attach -t hardhat-node
```

2. Stop the current node by pressing `Ctrl+C`.

3. Restart the Hardhat node:
```bash
npx hardhat node
```

4. Clear the nonce in MetaMask.

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

# Build and Push to Production
TBD.