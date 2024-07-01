import React, { useState, useEffect } from 'react';
import Stake from './Stake';
import Claim from './Claim';

const Game = ({ title, description, contractAddress }) => {
    const [canStake, setCanStake] = useState(false);
    const contractABI = [
        "function can_stake() public view returns (bool)"
    ];

    useEffect(() => {
        const checkCanStake = async () => {
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const canStake = await contract.can_stake();
            setCanStake(canStake);
        };

        checkCanStake();
    }, [contractAddress]);

    let component;
    if (canStake) {
        component = <Stake contractAddress={contractAddress} />;
    } else {
        component = <Claim contractAddress={contractAddress} />;
    }

    return (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
            {component}
            <hr />
        </div>
    );
};

export default Game;