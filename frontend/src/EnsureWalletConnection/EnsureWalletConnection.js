import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const EnsureWalletConnection = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          const signer = await provider.getSigner();
  
          setIsConnected(true);
          setSigner(signer);
          setProvider(provider);
        }
      } catch(e) {
        console.error(e)
      }
    };
    init();
  }, []);

  if (!isConnected) {
    return <div className="success-modal">
                <div className="success-content">
                  <span className="warning-message">
                    請確保metamask連接正常<br /></span>
                </div>
          </div>
  }

  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { provider, signer });
    }
    return child;
  });
};

export default EnsureWalletConnection;