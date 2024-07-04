import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Claim = ({ contractAddress }) => {
    const [canClaim, setCanClaim] = useState(false);
    const [signer, setSigner] = useState(null);

    const provider = new ethers.BrowserProvider(window.ethereum);
    
    const contractABI = [
        "function can_claim() public view returns (bool)",
        "function claim() external"
    ];

    const contractView = new ethers.Contract(contractAddress, contractABI, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    useEffect(() => {
        const checkCanClaim = async () => {
            const canClaim = await contractView.can_claim();
            setCanClaim(canClaim);
        };

        const loadSigner = async () => {
            const signer = await provider.getSigner();
            setSigner(signer);
        };

        checkCanClaim();
        loadSigner();
    }, [contract]);

    const handleClaim = async () => {
        const tx = await contract.claim();
        await tx.wait();
    };

    return (
        <div>
            <button onClick={handleClaim} disabled={!canClaim}>
                Claim Reward
            </button>
        </div>
    );
};

export default Claim;