import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Claim = ({ contractAddress }) => {
    const [canClaim, setCanClaim] = useState(false);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    useEffect(() => {
        const checkCanClaim = async () => {
            const canClaim = await contract.can_claim();
            setCanClaim(canClaim);
        };

        checkCanClaim();
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