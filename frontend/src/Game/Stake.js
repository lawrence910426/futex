import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

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
            <input type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} />
            <button onClick={handleStake}>Stake</button>
            <button onClick={() => handleSideSelection(1)}>Bet Yes</button>
            <button onClick={() => handleSideSelection(0)}>Bet No</button>
            <p>Yes Pot: {yesPot}</p>
            <p>No Pot: {noPot}</p>
            <p>Your Yes Bet: {yesBet}</p>
            <p>Your No Bet: {noBet}</p>
        </div>
    );
};

export default StakePage;