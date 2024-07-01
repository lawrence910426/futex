import React, { useState } from 'react';
import { ethers } from 'ethers';

const ApproveTokenTransfer = () => {
  const [signer, setSigner] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [amount, setAmount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      setSigner(signer);
    } else {
      console.error('Please install MetaMask!');
    }
  };

  const approveTransfer = async () => {
    if (!signer) {
      console.error('Please connect your wallet first!');
      return;
    }

    const tokenABI = [
      "function approve(address spender, uint256 amount) public returns (bool)"
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    try {
      const tx = await tokenContract.approve(contractAddress, ethers.parseUnits(amount, 6));
      console.log('Transaction:', tx);
      await tx.wait();
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error approving transfer:', error);
    }
  };

  const receiveTransfer = async () => {
    if (!signer) {
      console.error('Please connect your wallet first!');
      return;
    }

    const contractABI = [
      "function receiveUSDT(uint256 amount) external"
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const tx = await contract.receiveUSDT(ethers.parseUnits(amount, 6));
      console.log('Transaction:', tx);
      await tx.wait();
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error receiving transfer:', error);
    }
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>
        <input
          type="text"
          placeholder="Token Contract Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Spender Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Amount to Approve"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={approveTransfer}>Approve Transfer</button>
      <button onClick={receiveTransfer}>Receive Transfer</button>
    </div>
  );
};

export default ApproveTokenTransfer;
