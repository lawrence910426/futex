import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './claim.css';

const Claim = ({ contractAddress }) => {    
    const [canClaim, setCanClaim] = useState(false);
    const [signer, setSigner] = useState(null);
    const [claiming, setClaiming] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const provider = new ethers.BrowserProvider(window.ethereum);
    
    const contractABI = [
        "function can_claim() public view returns (bool)",
        "function claim() external"
    ];

    const contractView = new ethers.Contract(contractAddress, contractABI, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    useEffect(() => {
        const checkCanClaim = async () => {
            const canClaim = await contractView.can_claim();
            console.log('canClaim:', canClaim);  // 檢查回傳的值
            setCanClaim(canClaim);
        };
    
        const loadSigner = async () => {
            const signer = await provider.getSigner();
            setSigner(signer);
        };
    
        checkCanClaim();
        loadSigner();
    }, [contract]);

    const handleClaim = async () => {
        setClaiming(true);  // 按下按鈕後開始顯示「領取中」訊息
        try {
            const tx = await contract.claim();
            await tx.wait();
            setShowSuccessMessage(true);  // 顯示成功訊息
            setTimeout(() => {
                setShowSuccessMessage(false); // 三秒後隱藏成功訊息
            }, 10000);
        } catch (error) {
            console.error('領取失敗:', error);
        } finally {
            setClaiming(false);  // 領取完成後隱藏「領取中」訊息
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
                <div className="reward-content available">
                    <h2 className="md3-headline-small">贏爛了！恭喜您獲得</h2>
                    <h1 className="md3-display-large">USDT 25</h1>
                    <img src="https://i.postimg.cc/9F3Y79HX/image.jpg" alt="Reward Image" className="reward-image" />
                    <button className="md3-button md3-button-filled" onClick={handleClaim}>領取獎勵</button>
                </div>
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
