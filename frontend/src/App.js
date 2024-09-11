import React from 'react';
import Game from './Game/Game';
import EnsureWalletConnection from './EnsureWalletConnection/EnsureWalletConnection';

const App = () => {
  return (
    <EnsureWalletConnection>
      <Game />
    </EnsureWalletConnection>
  );
};



export default App;
