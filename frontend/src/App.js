import React from 'react';
import GamesCatalogue from './Catalogue/Catalogue';
import EnsureWalletConnection from './EnsureWalletConnection/EnsureWalletConnection';

const App = () => {
  return (
    <div>
      <EnsureWalletConnection>
        <GamesCatalogue />
      </EnsureWalletConnection>
  </div>
  );
};

export default App;
