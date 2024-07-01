import React from 'react';
import Game from './Game/Game';
import EnsureWalletConnection from './EnsureWalletConnection/EnsureWalletConnection';

const App = () => {
  return (
    <div>
      <h1>Approve Token Transfer</h1>
      <EnsureWalletConnection>
        <Game />
      </EnsureWalletConnection>
  </div>
  );
};

export default App;
