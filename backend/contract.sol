// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address _to, uint256 _value) external returns (bool success);
}

contract Game {
    IERC20 public usdtToken;

    uint256 public Yes_Total;
    uint256 public No_Total;

    uint256 public Maximum_Stake;

    mapping(address => uint256) public Yes_Traders;
    mapping(address => uint256) public No_Traders;

    address owner;
    uint public settlement;
    uint public stake_deadline;

    bool public outcome_win;
    bool public outcome_unknown;

    constructor(address _usdtTokenAddress, uint _settlement, uint _stake_deadline, uint256 _maximum_stake) {
        usdtToken = IERC20(_usdtTokenAddress);

        Yes_Total = 0;
        No_Total = 0;
        owner = msg.sender;
        stake_deadline = _stake_deadline;
        settlement = _settlement;
        Maximum_Stake = _maximum_stake;

        outcome_win = false;
        outcome_unknown = true;
    }

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

    function claim() external {
        if (!outcome_unknown) {
            // There is a result for the game.
            uint256 value = 0;
            if (outcome_win) {
                Yes_Traders[msg.sender] * No_Total / Yes_Total + Yes_Traders[msg.sender];
                Yes_Total -= Yes_Traders[msg.sender];
                Yes_Traders[msg.sender] = 0;
            } else {
                No_Traders[msg.sender] * Yes_Total / No_Total + No_Traders[msg.sender];
                No_Total -= No_Traders[msg.sender];
                No_Traders[msg.sender] = 0;
            }

            // Claim the rewards back with 5% of commision.
            usdtToken.transfer(msg.sender, value * 95 / 100);
            usdtToken.transfer(owner, value * 5 / 100);

        } else {
            // There is no result for the game yet.
            if (block.timestamp > settlement) {
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

    function set_outcome(bool is_win) public {
        require(msg.sender == owner);
        outcome_win = is_win;
        outcome_unknown = false;
    }

    function can_stake() public view returns (bool) {
        return block.timestamp < stake_deadline;
    }

    function can_claim() public view returns (bool) {
        return (!outcome_unknown) || (block.timestamp > settlement && outcome_unknown);
    }

    function max_stake() public view returns (uint256) {
        return Maximum_Stake - Yes_Total - No_Total;
    }
}
