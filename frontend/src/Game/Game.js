import React from 'react';
import Stake from './Stake';

const Game = ({ title, description, contractAddress }) => {
    return (
        <div>
            <Stake contractAddress={contractAddress} />
        </div>
    );
};

export default Game;