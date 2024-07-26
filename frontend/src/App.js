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
  return (
    <EnsureWalletConnection>
      <Game tokenAddress={config.TOKEN_ADDRESS} />
    </EnsureWalletConnection>
  );
};

export default App;
