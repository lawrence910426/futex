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

const BettingComponent = ({ maxStake, contract, tokenContract, yesPot, noPot }) => {
    const [amount, setAmount] = useState('50');
    const [selectedSide, setSelectedSide] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const calculateWinOdds = (noTotal, yesTotal, bet) => {
        return (noTotal / (yesTotal + bet)) * bet + 1;
    };

    const calculateLossOdds = (yesTotal, noTotal, bet) => {
        return (yesTotal / (noTotal + bet)) * bet + 1;
    };

    const winOdds = calculateWinOdds(noPot, yesPot, amount);
    const lossOdds = calculateLossOdds(yesPot, noPot, amount);

    const handleAmountChange = (change) => {
        const newAmount = (parseFloat(amount) + change).toString();
        if (parseFloat(newAmount) >= 0) {
            if (parseFloat(newAmount) > maxStake) {
                setError('金额超過最大下注金額：' + maxStake);
            } else {
                setError('');
                setAmount(parseFloat(newAmount));
            }
        }
    };

    const handleInputChange = (event) => {
        const inputAmount = event.target.value;
        if (inputAmount === '') { 
            setAmount('0'); // 修改: 將空字符串設置為 '0'
            setError('');
        } else if (!isNaN(inputAmount) && parseFloat(inputAmount) >= 0) {
            if (parseFloat(inputAmount) > maxStake) {
                setError('金额超過最大下注金額：' + maxStake);
            } else {
                setError('');
                setAmount(inputAmount); // 修改: 直接將輸入值作為字符串設置
            }
        } else {
            setError('請輸入有效的金額');
        }
    };
    const handleSideSelection = (side) => {
        setSelectedSide(side);
    };

    const handleStake = async () => {
        setIsLoading(true); // 開始顯示等待視窗

        try {
            const size = ethers.parseUnits(amount.toString(), 6);
            
            if(parseFloat(size) > parseFloat(maxStake)) {
                setError('金额超過最大下注金額：' + maxStake);
                setIsLoading(false);
                return;
            }
            
            // Approve the token transfer
            const tx = await tokenContract.approve(contract.target, size);
            await tx.wait();
    
            // Stake the tokens
            const tx2 = await contract.stake(size, selectedSide === 1);
            await tx2.wait();

            // 成功後顯示成功訊息
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false); // 三秒後隱藏成功訊息
            }, 3000);

        } catch (err) {
            console.error('下注過程出錯:', err);
            setError('下注過程出錯，請重試。');
        } finally {
            setIsLoading(false); // 隱藏等待視窗
        }

    };

    return (
        <div className="betting-container">
            <div class="betting-options">
                <div className="betting-option-container">
                    <span className={`odds-label yes ${selectedSide === 1 ? 'active' : ''}`}>會的賠率</span>
                    <button
                        className={`betting-option ${selectedSide === 1 ? 'active' : ''}`}
                        onClick={() => handleSideSelection(1)}
                        disabled={!canStake}
                    >
                        {winOdds.toFixed(2)}
                    </button>
                </div>
                <div className="betting-option-container">
                    <span className={`odds-label no ${selectedSide === 0 ? 'active' : ''}`}>不會的賠率</span>
                    <button
                        className={`betting-option no ${selectedSide === 0 ? 'active' : ''}`}
                        onClick={() => handleSideSelection(0)}
                        disabled={!canStake}
                    >
                        {lossOdds.toFixed(2)}
                    </button>
                </div>
            </div>

            <div className="betting-outcome">下標金額</div>
            <div className="betting-amount-wrapper">
                <div className={`betting-amount ${error ? 'error' : ''}`}>
                    <button className="amount-control" onClick={() => handleAmountChange(-10)}>-</button>
                    <input 
                          type="text" 
                          value={amount} 
                          onChange={handleInputChange} 
                          onKeyDown={(e) => console.log('Key Down: ', e.key)}
                          style={{ color: parseFloat(amount) >= maxStake ? '#CA5724' : 'black' }} 
                          onFocus={() => console.log("Input Focused")}
                    />
                    <button 
                        className="amount-control" 
                        onClick={() => handleAmountChange(10)} 
                        disabled={amount > maxStake}
                        style={amount >= maxStake ? { backgroundColor: '#F0F0F0', color: '#D9D9D9', cursor: 'not-allowed' } : {}}
                    >+</button>
                </div>
                {error && <div className="error">{error}</div>}
            </div>
            <button className={`bet-button ${selectedSide === 0 ? 'no' : ''}`} onClick={handleStake}>
                BET {selectedSide === 1 ? 'YES' : 'NO'}
                <br />
                <span className="to-win">To win USDT {(amount * (selectedSide === 1 ? winOdds : lossOdds)).toFixed(2)}</span>
            </button>

            {isLoading && (
                <div className="loading-modal">
                    <div className="loading-content">
                        <h2 className="loading-text">
                            點擊下一頁,批准及確認以下注，<br />
                            並耐心等候......
                        </h2>
                    </div>
                </div>
            )}

            {showSuccessMessage && ( // 顯示成功訊息
                <div className="success-modal">
                    <div className="success-content">
                        <h2 className="success-text">下注成功！</h2>
                    </div>
                </div>
            )}
        </div>
    );
};


const StakePage = ({ contractAddress, tokenAddress }) => {
    const [yesPot, setYesPot] = useState(0);
    const [noPot, setNoPot] = useState(0);
    const [yesBet, setYesBet] = useState(0);
    const [noBet, setNoBet] = useState(0);
    const [signer, setSigner] = useState(null);
    const [maxStake, setMaxStake] = useState(0);
    const [canStake, setCanStake] = useState(false);  
    const [showHelp, setShowHelp] = useState(false); 

    const provider = new ethers.BrowserProvider(window.ethereum);

    const tokenABI = [
        "function approve(address _spender, uint256 _value) public returns (bool)",
    ];
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    const contractABI = [
        "function stake(uint256 amount, bool is_win) external",
    ];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const contractViewABI = [
        "function max_stake() public view returns (uint256)",
        "function Yes_Traders(address) view returns (uint256)",
        "function No_Traders(address) view returns (uint256)",
        "function Yes_Total() public view returns (uint256)",
        "function No_Total() public view returns (uint256)",
    ];
    const contractView = new ethers.Contract(contractAddress, contractViewABI, provider);

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

        const checkCanStake = async () => {  
            const stakeStatus = await contractView.can_stake();
            setCanStake(stakeStatus);
        };
        
        getStakeTotals();
        getUserStakes();
        getMaxStake();
        loadSigner();
        checkCanStake();  
    }, [contractView]);

    return (
        <div>
            <CurrentPotStatus yesBet={yesBet} noBet={noBet} />
            <BettingComponent 
                maxStake={maxStake}
                tokenContract={tokenContract}
                contract={contract}
                yesPot={yesPot}
                noPot={noPot}
            />
            <BettingResult yesPot={yesPot} noPot={noPot} />
        </div>
    );
};

export default StakePage;
