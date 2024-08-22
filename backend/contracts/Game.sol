// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address _to, uint256 _value) external returns (bool success);
}

contract Game {
    // The contract address of USDT (or the ERC-20 token that we are playing)
    IERC20 public usdtToken;

    // The total pot on betting Yes. 
    uint256 public Yes_Total;

    // The total pot on betting No.
    uint256 public No_Total;

    // We guarantee `Yes-Total + No-Total < Maximum`
    uint256 public Maximum_Stake;

    // Yes_Traders[address] is the amount of `address` betting on Yes.
    mapping(address => uint256) public Yes_Traders;

    // No_Traders[address] is the amount of `address` betting on No.
    mapping(address => uint256) public No_Traders;

    // The owner of the game contract. The owner is responsible for deciding
    // the outcome and receives a service fee from the winners.
    address owner;

    // After stake_deadline, traders may no longer bet on this contract.
    uint public stake_deadline;

    // If the outcome is not decided by this deadline, traders can 
    // reclaim their bets without any service fee.
    uint public outcome_deadline;

    // Indicates whether the outcome is yet to be decided.
    bool public outcome_unknown;

    // Indicates the outcome of the game: true if Yes wins, false otherwise.
    bool public outcome_win;

    // Initialize the contract. The person who initializes the contract will become the owner.
    constructor(address _usdtTokenAddress, uint _outcome_deadline, uint _stake_deadline, uint256 _maximum_stake) {
        usdtToken = IERC20(_usdtTokenAddress);

        Yes_Total = 0;
        No_Total = 0;
        owner = msg.sender;
        stake_deadline = _stake_deadline;
        outcome_deadline = _outcome_deadline;
        Maximum_Stake = _maximum_stake;

        outcome_win = false;
        outcome_unknown = true;
    }

    // Place a bet with the specified amount. Set is_win to true to bet on Yes, false to bet on No.
    function stake(uint256 amount, bool is_win) external {
        require(block.timestamp < stake_deadline);
        require(amount > 0 && amount + Yes_Total + No_Total <= Maximum_Stake, "Exceed maximum stake amount");

        // Receive the ERC-20 token transfer
        require(usdtToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        if (is_win) {
            Yes_Total += amount;
            Yes_Traders[msg.sender] += amount;
        } else {
            No_Total += amount;
            No_Traders[msg.sender] += amount;
        }
    }

    // Call this function to claim your reward.
    function claim() external {
        if (!outcome_unknown) {
            // There is a result for the game.
            uint256 value = 0;
            if (outcome_win) {
                // Split the pot
                value = Yes_Traders[msg.sender] * No_Total / Yes_Total;
                No_Total -= value;

                // Take back the stake
                value += Yes_Traders[msg.sender];
                Yes_Total -= Yes_Traders[msg.sender];
                Yes_Traders[msg.sender] = 0;
            } else {
                // Split the pot
                value = No_Traders[msg.sender] * Yes_Total / No_Total;
                Yes_Total -= value;
                
                // Take back the stake
                value += No_Traders[msg.sender];
                No_Total -= No_Traders[msg.sender];
                No_Traders[msg.sender] = 0;
            }

            // Claim the rewards back with 5% of commision.
            usdtToken.transfer(msg.sender, value * 95 / 100);
            usdtToken.transfer(owner, value * 5 / 100);

        } else {
            // There is no result for the game yet.
            if (block.timestamp > outcome_deadline) {
                // Claim their stakes back without any commision.
                Yes_Total -= Yes_Traders[msg.sender];
                usdtToken.transfer(msg.sender, Yes_Traders[msg.sender]);
                Yes_Traders[msg.sender] = 0;

                No_Total -= No_Traders[msg.sender];
                usdtToken.transfer(msg.sender, No_Traders[msg.sender]);
                No_Traders[msg.sender] = 0;
            }
        }
    }

    // The owner can set the outcome of the game using this function.
    function set_outcome(bool is_win) public {
        require(msg.sender == owner);
        outcome_win = is_win;
        outcome_unknown = false;
    }

    // Traders can call this function to check if betting is still allowed.
    function can_stake() public view returns (bool) {
        return block.timestamp < stake_deadline;
    }

    // Traders can call this function to check if they can claim their winnings.
    function can_claim() public view returns (bool) {
        return (!outcome_unknown) || (block.timestamp > outcome_deadline && outcome_unknown);
    }

    // Traders can call this function to check the remaining available stake.
    function max_stake() public view returns (uint256) {
        return Maximum_Stake - Yes_Total - No_Total;
    }
}
