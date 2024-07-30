import React, { useState, useEffect } from 'react';
import Stake from './Stake';
import Claim from './Claim';
import { ethers } from 'ethers';

const Game = ({ tokenAddress, contractAddress }) => {   
    const [canStake, setCanStake] = useState(false);
    const contractABI = [
        "function can_stake() public view returns (bool)"
    ];

    const provider = new ethers.BrowserProvider(window.ethereum);
    useEffect(() => {
        const checkCanStake = async () => {
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            const canStake = await contract.can_stake();
            setCanStake(canStake);
        };

        checkCanStake();
    }, [contractAddress]);

    let component;
    if (canStake) {
        component = <Stake contractAddress={contractAddress} tokenAddress={tokenAddress} />;
    } else {
        component = <Claim contractAddress={contractAddress} />;
    }

    return (
        <div> {component} </div>
    );
};

export default Game;