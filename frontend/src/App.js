import React from 'react';
import Game from './Game/Game';
import EnsureWalletConnection from './EnsureWalletConnection/EnsureWalletConnection';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

let config;
if (process.env.NODE_ENV === 'development') {
    config = require('./config/config.development.json');
} else if (process.env.NODE_ENV === 'production') {
    config = require('./config/config.production.json');
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Please enter your contract address</div>,
  },
  {
    path: "/:contractAddress",
    element: 
      <EnsureWalletConnection>
        <Game tokenAddress={config.TOKEN_ADDRESS} />
      </EnsureWalletConnection>,
  },
]);


const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
