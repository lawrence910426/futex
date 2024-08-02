import Stake from './Stake';
import Claim from './Claim';

let config;
if (process.env.NODE_ENV === 'development') {
    config = require('../config/config.development.json');
} else if (process.env.NODE_ENV === 'production') {
    config = require('../config/config.production.json');
}

const Game = ({}) => {   
    const query = new URLSearchParams(window.location.search);
    const contractAddress = query.get('contractAddress') || config.CONTRACT_ADDRESS;
    const viewMode = query.get('viewMode') || "stake";
    const tokenAddress = config.TOKEN_ADDRESS;

    let component;
    if (viewMode == 'stake') {
        component = <Stake contractAddress={contractAddress} tokenAddress={tokenAddress} />;
    } else {
        component = <Claim contractAddress={contractAddress} />;
    }

    return (
        <div> {component} </div>
    );
};

export default Game;