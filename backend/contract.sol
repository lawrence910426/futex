// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address _to, uint256 _value) external returns (bool success);
}

enum Side {
    Yes,
    No,
    Unknown
}

contract Game {
    IERC20 public usdtToken;

    uint256 public Yes_Total;
    uint256 public No_Total;

    mapping(address => uint256) public Yes_Traders;
    mapping(address => uint256) public No_Traders;

    address owner;
    uint public settlement;
    uint public stake_deadline;

    Side public outcome;

    constructor(address _usdtTokenAddress, uint _settlement, uint _stake_deadline) {
        usdtToken = IERC20(_usdtTokenAddress);

        Yes_Total = 0;
        No_Total = 0;
        owner = msg.sender;
        stake_deadline = _stake_deadline;
        settlement = _settlement;

        outcome = Side.Unknown;
    }

    function stake(uint256 amount, Side side) external {
        require(side == Side.Yes || side == Side.No);
        require(block.timestamp < stake_deadline);

        // Receive the ERC-20 token transfer
        require(usdtToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        if (side == Side.Yes) {
            Yes_Total += amount;
            Yes_Traders[msg.sender] += amount;
        }
        if (side == Side.No) {
            No_Total += amount;
            No_Traders[msg.sender] += amount;
        }
    }

    function claim() external {
        if (outcome == Side.Yes) {
            uint256 value = Yes_Traders[msg.sender] / Yes_Total * No_Total + Yes_Traders[msg.sender];
            Yes_Total -= Yes_Traders[msg.sender];
            Yes_Traders[msg.sender] = 0;
            usdtToken.transfer(msg.sender, value * 95 / 100);
            usdtToken.transfer(owner, value * 5 / 100);
        }

        if (outcome == Side.No) {
            uint256 value = No_Traders[msg.sender] / No_Total * Yes_Total + No_Traders[msg.sender];
            No_Total -= No_Traders[msg.sender];
            No_Traders[msg.sender] = 0;
            usdtToken.transfer(msg.sender, value * 95 / 100);
            usdtToken.transfer(owner, value * 5 / 100);
        }

        if (outcome == Side.Unknown && block.timestamp > settlement) {
            Yes_Total -= Yes_Traders[msg.sender];
            usdtToken.transfer(msg.sender, Yes_Traders[msg.sender]);
            Yes_Traders[msg.sender] = 0;

            No_Total -= No_Traders[msg.sender];
            usdtToken.transfer(msg.sender, No_Traders[msg.sender]);
            No_Traders[msg.sender] = 0;
        }
    }

    function set_outcome(Side _outcome) public {
        require(msg.sender == owner);
        outcome = _outcome;
    }
}
