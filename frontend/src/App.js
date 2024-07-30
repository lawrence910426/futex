import React from 'react';
import Game from './Game/Game';
import EnsureWalletConnection from './EnsureWalletConnection/EnsureWalletConnection';

let config;
if (process.env.NODE_ENV === 'development') {
    config = require('./config/config.development.json');
} else if (process.env.NODE_ENV === 'production') {
    config = require('./config/config.production.json');
}

const App = () => {
  const query = new URLSearchParams(window.location.search);
  const contractAddress = query.get('contractAddress') || config.CONTRACT_ADDRESS;

  return (
    <EnsureWalletConnection>
      <Game tokenAddress={config.TOKEN_ADDRESS} contractAddress={contractAddress} />
    </EnsureWalletConnection>
  );
};

export default App;
