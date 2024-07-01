import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const StakePage = ({ contractAddress }) => {
    const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;

    const [stakeAmount, setStakeAmount] = useState('');
    const [side, setSide] = useState(0);
    const [yesPot, setYesPot] = useState(0);
    const [noPot, setNoPot] = useState(0);
    const [yesBet, setYesBet] = useState(0);
    const [noBet, setNoBet] = useState(0);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();


    const tokenABI = [
        "function approve(address spender, uint256 amount) public returns (bool)"
    ];

    const contractABI = [
        "function get_stake_total() public view returns (uint256, uint256)",
        "function get_stake() public view returns (uint256, uint256)",
        "function stake(uint256 amount, Side side) external"
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const handleStake = async () => {
        // Approve the token transfer
        const tx = await tokenContract.approve(contractAddress, ethers.parseEther(stakeAmount));
        await tx.wait();

        // Stake the tokens
        const tx2 = await contract.stake(ethers.parseEther(stakeAmount), side);
        await tx2.wait();
    };

    const handleSideSelection = (selectedSide) => {
        setSide(selectedSide);
    };

    useEffect(() => {
        const getStakeTotals = async () => {
            const [yesPot, noPot] = await contract.get_stake_total();
            setYesPot(ethers.formatEther(yesPot));
            setNoPot(ethers.formatEther(noPot));
        };

        const getUserStakes = async () => {
            const [yesBet, noBet] = await contract.get_stake(window.ethereum.selectedAddress);
            setYesBet(ethers.formatEther(yesBet));
            setNoBet(ethers.formatEther(noBet));
        };

        getStakeTotals();
        getUserStakes();
    }, [contract]);

    return (
        <div>
            <input type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} />
            <button onClick={handleStake}>Stake</button>
            <button onClick={() => handleSideSelection(0)}>Bet Yes</button>
            <button onClick={() => handleSideSelection(1)}>Bet No</button>
            <p>Yes Pot: {yesPot}</p>
            <p>No Pot: {noPot}</p>
            <p>Your Yes Bet: {yesBet}</p>
            <p>Your No Bet: {noBet}</p>
        </div>
    );
};

export default StakePage;