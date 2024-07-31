import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CurrentPotStatus = ({ yesBet, noBet }) => {
    return (
        <div className="pot-container">
            <div className="option yes-option">
                <span className="label">Yes pot</span>
                <span className="amount">USDT {yesBet}</span>
            </div>
            <div className="divider"></div>
            <div className="option no-option">
                <span className="label">No Bet</span>
                <span className="amount">USDT {noBet}</span>
            </div>
        </div>
    );
};

const BettingResult = ({ yesPot, noPot }) => {
    return (
        <div className="pot-container">
            <div className="option yes-option">
                <span className="label">My yes pot</span>
                <span className="amount">USDT {yesPot}</span>
            </div>
            <div className="divider"></div>
            <div className="option no-option">
                <span className="label">My no pot</span>
                <span className="amount">USDT {noPot}</span>
            </div>
        </div>
    );
};

const BettingComponent = ({ onAmountChange, onSideChange, handleStake, yesPot, noPot }) => {
    const [amount, setAmount] = useState(50);
    const [selectedSide, setSelectedSide] = useState(1);
    const [error, setError] = useState('');


    const handleAmountChange = (change) => {
    const newAmount = (parseFloat(amount) + change).toString();
        if (parseFloat(newAmount) >= 0) {
            if (parseFloat(newAmount) > 100) {
                setError('金额應小於100');
            } else {
                setError('');
                setAmount(parseFloat(newAmount));
                onAmountChange(newAmount);
            }
        }
    };

    const handleSideSelection = (side) => {
        setSelectedSide(side);
        onSideChange(side);
    };

    

    return (
        <div className="betting-container">
            <div className="betting-header">賠率</div>
            <div className="betting-options">
                <button
                    className={`betting-option ${selectedSide === 1 ? 'active' : ''}`}
                    onClick={() => handleSideSelection(1)}
                >
                    YES 1.8
                </button>
                <button
                    className={`betting-option ${selectedSide === 0 ? 'active no' : ''}`}
                    onClick={() => handleSideSelection(0)}
                >
                    NO 2.2
                </button>
            </div>
            <div className="betting-outcome">下標金額</div>
            <div className="betting-amount-wrapper">
                <div className={`betting-amount ${error ? 'error' : ''}`}>
                    <button className="amount-control" onClick={() => handleAmountChange(-10)}>-</button>
                    <input type="text" value={amount} readOnly style={{ color: amount >= 100 ? '#CA5724' : 'black' }} />
                    <button 
                        className="amount-control" 
                        onClick={() => handleAmountChange(10)} 
                        disabled={amount > 100}
                        style={amount >= 100 ? { backgroundColor: '#F0F0F0', color: '#D9D9D9', cursor: 'not-allowed' } : {}}
                    >+</button>
                </div>
                {error && <div className="error">{error}</div>}
            </div>
            <button className={`bet-button ${selectedSide === 0 ? 'no' : ''}`} onClick={handleStake}>
                BET {selectedSide === 1 ? 'YES' : 'NO'}
                <br />
                <span className="to-win">To win USDT {(amount * (selectedSide === 1 ? 1.8 : 2.2)).toFixed(2)}</span>
            </button>
        </div>
    );
};


const StakePage = ({ contractAddress, tokenAddress }) => {
    const [stakeAmount, setStakeAmount] = useState('');
    const [side, setSide] = useState(0);
    const [yesPot, setYesPot] = useState(0);
    const [noPot, setNoPot] = useState(0);
    const [yesBet, setYesBet] = useState(0);
    const [noBet, setNoBet] = useState(0);
    const [maxStake, setMaxStake] = useState(0);
    const [signer, setSigner] = useState(null);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const tokenABI = [
        "function approve(address _spender, uint256 _value) public returns (bool)",
    ];

    const contractABI = [
        "function stake(uint256 amount, bool is_win) external",
    ];

    const contractViewABI = [
        "function max_stake() public view returns (uint256)",
        "function Yes_Traders(address) view returns (uint256)",
        "function No_Traders(address) view returns (uint256)",
        "function Yes_Total() public view returns (uint256)",
        "function No_Total() public view returns (uint256)",
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const contractView = new ethers.Contract(contractAddress, contractViewABI, provider);

    const handleStake = async () => {
        if (!stakeAmount || isNaN(stakeAmount)) {
            alert('Please enter a valid stake amount');
            return;
        }
        const amountToStake = stakeAmount === '' ? '0' : stakeAmount.toString();
        const size = ethers.parseUnits(stakeAmount, 6);

        if (parseFloat(size) > parseFloat(maxStake)) {
          alert('Your stake amount exceeds the maximum stake limit');
          return;
        }
        
        // Approve the token transfer
        const tx = await tokenContract.approve(contractAddress, size);
        await tx.wait();
    
        // Stake the tokens
        const tx2 = await contract.stake(size, side === 1);
        await tx2.wait();

        // Update the pots after staking
        const yesTotal = await contractView.Yes_Total(); /* 修改：更新 Yes_Total */
        setYesPot(ethers.formatUnits(yesTotal, 6)); /* 修改：設定 yesPot */

        const noTotal = await contractView.No_Total(); /* 修改：更新 No_Total */
        setNoPot(ethers.formatUnits(noTotal, 6)); /* 修改：設定 noPot */
    };

    const handleSideSelection = (selectedSide) => {
        setSide(selectedSide);
    };

    useEffect(() => {
        const getStakeTotals = async () => {
            const yesTotal = await contractView.Yes_Total();
            setYesPot(ethers.formatUnits(yesTotal, 6));

            const noTotal = await contractView.No_Total();
            setNoPot(ethers.formatUnits(noTotal, 6));
        };

        const getUserStakes = async () => {
            if (!signer) return;
            
            const yesBet = await contractView.Yes_Traders(await signer.getAddress());
            setYesBet(ethers.formatUnits(yesBet, 6));

            const noBet = await contractView.No_Traders(await signer.getAddress());
            setNoBet(ethers.formatUnits(noBet, 6));
        };

        const getMaxStake = async () => {
            const mxStake = await contractView.max_stake();
            setMaxStake(mxStake);
        };

        const loadSigner = async () => {
            const signer = await provider.getSigner();
            setSigner(signer);
        };
        
        getStakeTotals();
        getUserStakes();
        getMaxStake();
        loadSigner();
    }, [contractView]);

    return (
        <div>
            <CurrentPotStatus yesBet={yesBet} noBet={noBet} />
            <BettingComponent
                onAmountChange={setStakeAmount}
                onSideChange={setSide}
                handleStake={handleStake}  
            />
            <BettingResult yesPot={yesPot} noPot={noPot} /> {/* 修改：新增 BettingResult 元件 */}
        </div>
    );
};

const App = () => {
    return (
        <div>
            <StakePage 
                contractAddress="0xYourContractAddress1" 
                tokenAddress="0xYourTokenAddress1"
                title="Betting on Typhoon"
                description="Would the typhoon hit Taiwan in 2024?"
            />
            <StakePage 
                contractAddress="0xYourContractAddress2" 
                tokenAddress="0xYourTokenAddress2"
                title="Betting on TSMC"
                description="Would price of TSMC reaches 1000 before 2024/12/31?"
            />
        </div>
    );
};
export default StakePage;