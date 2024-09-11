import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CurrentPotStatus = ({ yesBet, noBet }) => {
    return (
        <div className="pot-container">
            <div className="option yes-option">
                <span className="label">會(總和)</span>
                <span className="amount">USDT {yesBet}</span>
            </div>
            <div className="divider"></div>
            <div className="option no-option">
                <span className="label">不會(總和)</span>
                <span className="amount">USDT {noBet}</span>
            </div>
        </div>
    );
};

const BettingResult = ({ yesPot, noPot }) => {
    return (
        <div className="pot-container">
            <div className="option yes-option">
                <span className="label">會(個人)</span>
                <span className="amount">USDT {yesPot}</span>
            </div>
            <div className="divider"></div>
            <div className="option no-option">
                <span className="label">不會(個人)</span>
                <span className="amount">USDT {noPot}</span>
            </div>
        </div>
    );
};

const BettingComponent = ({ maxStake, contract, tokenContract, yesPot, noPot, canStake }) => { 
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
            setAmount('0'); 
            setError('');
        } else if (!isNaN(inputAmount) && parseFloat(inputAmount) >= 0) {
            if (parseFloat(inputAmount) > maxStake) {
                setError('金额超過最大下注金額：' + maxStake);
            } else {
                setError('');
                setAmount(inputAmount); 
            }
        } else {
            setError('請輸入有效的金額');
        }
    };
    const handleSideSelection = (side) => {
        setSelectedSide(side);
    };

    const handleStake = async () => {
        // 在開始下注過程前清除錯誤與成功訊息
        setError('');
        setShowSuccessMessage(false);
        setIsLoading(true); 
    
        try {
            const size = ethers.parseUnits(amount.toString(), 6);
            
            if(parseFloat(size) > parseFloat(maxStake)) {
                setError('金额超過最大下注金額：' + maxStake);
                setIsLoading(false);
                return;
            }
            
            const tx = await tokenContract.approve(contract.target, size);
            await tx.wait();
        
            const tx2 = await contract.stake(size, selectedSide === 1);
            await tx2.wait();
        
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        
        } catch (err) {
            console.error('下注過程出錯:', err);
            setError('下注過程出錯，請重試。');
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isLoading) {
                e.preventDefault();
                e.returnValue = '交易進行中，確認要刷新頁面?'; // 設置自定義的警告訊息
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isLoading]);
    
    return (
        <div className="betting-container">
            <div className="betting-options">
                <button
                    className={`betting-option ${selectedSide === 1 ? 'active' : ''}`}
                    onClick={() => handleSideSelection(1)}
                    disabled={!canStake}
                >
                    會的賠率：{winOdds.toFixed(2)}
                </button>
                <button
                    className={`betting-option ${selectedSide === 0 ? 'active no' : ''}`}
                    onClick={() => handleSideSelection(0)}
                    disabled={!canStake}
                >
                    不會的賠率： {lossOdds.toFixed(2)}
                </button>
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
                          disabled={!canStake}
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
            <button 
                className={`bet-button ${selectedSide === 0 ? 'no' : ''}`} 
                onClick={handleStake}
                disabled={!canStake}  
            >
                下注 {selectedSide === 1 ? '會' : '不會'}
                <br />
                <span className="to-win">以贏得 USDT {(amount * (selectedSide === 1 ? winOdds : lossOdds)).toFixed(2)}</span>
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

            {showSuccessMessage && ( 
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
    const [showHelp, setShowHelp] = useState(false);  // 新增: 定義 showHelp 和 setShowHelp 變量

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
        "function can_stake() public view returns (bool)",  
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
                canStake={canStake}  
            />
            <BettingResult yesPot={yesPot} noPot={noPot} />
            <button className="help-button" onClick={() => setShowHelp(!showHelp)}>?</button> {/* 修改: 使用 setShowHelp 切換 showHelp 狀態 */}
            {showHelp && (
                <div className="help-card"> {/* 修改: 顯示幫助訊息字卡 */}
                    <h4>（註：下注過程的等待時間可能長達30秒至1分鐘，請耐心等候，謝謝！）</h4>
                    <h4>賠率的計算</h4>
                    <p>賠率簡單來說，就是你下注後能贏多少錢。在這裡，我們的賠率會根據大家怎麼下注來變動：</p>
                    <h5>贏的賠率：</h5>
                    <p>如果你選擇的結果比較少人下注，那麼你的回報會比較高。意思是，你選了一個大家不太看好的選項，如果你贏了，你就能拿回更多錢。</p>
                    <h5>輸的賠率：</h5>
                    <p>如果你選的結果很多人下注，即使你輸了，損失也不會太大。這是因為賠率比較低。</p>
                    <p>總的來說，賠率會根據大家的下注情況來決定，如果你押的是冷門選項，贏了就賺得多；如果押熱門選項，輸了也不會虧太多。這樣你可以選擇風險大或小的下注方式。</p>
                </div>
            )}
        </div>
    );
};

export default StakePage;
