import React from 'react';
import Game from '../Game/Game';

let config;
if (process.env.NODE_ENV === 'development') {
    config = require('../config/config.development.json');
} else if (process.env.NODE_ENV === 'production') {
    config = require('../config/config.production.json');
}

const GamesCatalogue = () => {
    return (
        <div>
            {config.map((game, index) => (
                <Game 
                    key={index}
                    title={game.TITLE}
                    description={game.DESCRIPTION}
                    contractAddress={game.CONTRACT_ADDRESS}
                />
            ))}
        </div>
    );
};

export default GamesCatalogue;