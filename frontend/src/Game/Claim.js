import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './claim.css';

const Claim = ({ contractAddress }) => {    
    const [canClaim, setCanClaim] = useState(false);
    const [signer, setSigner] = useState(null);
    const [claiming, setClaiming] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [rewardAmount, setRewardAmount] = useState('0');
    const [isEligibleForClaim, setIsEligibleForClaim] = useState(true); // 新增：用來記錄用戶是否符合領取資格

    const provider = new ethers.BrowserProvider(window.ethereum);
    
    const contractABI = [
        "function can_claim() public view returns (bool)",
        "function claim() external",
        "function Yes_Total() public view returns (uint256)",
        "function No_Total() public view returns (uint256)",
        "function Yes_Traders(address) view returns (uint256)",
        "function No_Traders(address) view returns (uint256)" // 新增：用來檢查用戶的 No Pot 金額
    ];

    const contractView = new ethers.Contract(contractAddress, contractABI, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    useEffect(() => {
        const checkCanClaim = async () => {
            const canClaim = await contractView.can_claim();
            console.log('canClaim:', canClaim);
            setCanClaim(canClaim);
        };
    
        const loadSigner = async () => {
            const signer = await provider.getSigner();
            setSigner(signer);
        };

        const calculateReward = async () => {
            if (!signer) return;

            const yesTotal = await contractView.Yes_Total();
            const noTotal = await contractView.No_Total();
            const myYesPot = await contractView.Yes_Traders(await signer.getAddress());

            // 計算獎勵金額
            const reward = ethers.formatUnits(noTotal, 6) / ethers.formatUnits(yesTotal, 6) * ethers.formatUnits(myYesPot, 6);
            setRewardAmount(reward.toFixed(2));
        };

        const checkEligibility = async () => {
            if (!signer) return;

            const myYesPot = await contractView.Yes_Traders(await signer.getAddress());
            const myNoPot = await contractView.No_Traders(await signer.getAddress());

            // 如果 Yes_Traders 和 No_Traders 中的值都為零，則用戶不符合領取資格
            if (myYesPot === 0 && myNoPot === 0) {
                setIsEligibleForClaim(false);
            }
        };
    
        checkCanClaim();
        loadSigner();
        calculateReward();
        checkEligibility(); // 新增：檢查用戶的領取資格
    }, [contractView, signer]);

    const handleClaim = async () => {
        setClaiming(true);
        try {
            const tx = await contract.claim();
            await tx.wait();
            setShowSuccessMessage(true);
            setIsEligibleForClaim(false);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 10000);
        } catch (error) {
            console.error('領取失敗:', error);
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="reward-card md3-elevation-3">
            {claiming ? (
                <div className="claiming-message">
                    <span className="md3-headline-small">
                        點擊確認以領取獎勵，<br />
                        並耐心等候......
                    </span>
                </div>
            ) : showSuccessMessage ? ( 
                <div className="success-message">
                    <span className="md3-headline-small">獎勵領取成功！</span>
                </div>
            ) : canClaim ? (
                isEligibleForClaim ? (
                    <div className="reward-content available">
                        <h2 className="md3-headline-small">贏爛了！恭喜您獲得</h2>
                        <h1 className="md3-display-large">USDT {rewardAmount}</h1>
                        <img src="https://i.postimg.cc/9F3Y79HX/image.jpg" alt="Reward Image" className="reward-image" />
                        <button className="md3-button md3-button-filled" onClick={handleClaim}>領取獎勵</button>
                    </div>
                ) : (
                    <div className="reward-content unavailable">
                        <h2 className="md3-headline-small">您不符合領取資格</h2>
                        <img src="https://i.postimg.cc/3NSJnQCS/image.png" alt="No Reward Image" className="reward-image" />
                    </div>
                )
            ) : (
                <div className="reward-content unavailable">
                    <h2 className="md3-headline-small">尚未開獎，敬請期待!</h2>
                    <h1 className="md3-display-large">USDT ?</h1>
                    <img src="https://i.postimg.cc/KYQbJwnQ/mystery3.png" alt="Waiting Image" className="reward-image" />
                    <button className="md3-button md3-button-filled unavailable" disabled>尚未開獎</button>
                </div>
            )}
        </div>
    );
};

export default Claim;
