import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './claim.css';


const Claim = ({ contractAddress }) => {
    const [canClaim, setCanClaim] = useState(false);
    const [signer, setSigner] = useState(null);
    const [manualClaim, setManualClaim] = useState(false);

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
        const tx = await contract.claim();
        await tx.wait();
    };

    return (
        <div className="reward-card md3-elevation-3">
        <button onClick={() => setManualClaim(!manualClaim)}>切換測試狀態</button>
        {manualClaim ? (
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