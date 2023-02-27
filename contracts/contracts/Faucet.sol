// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

error Unauthorized();

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Owned {
	address public owner;

	constructor() {
		owner = msg.sender;
	}

	modifier onlyOwner(){
		if (msg.sender != owner)
			revert Unauthorized();
		_;
	}
}


contract Mortal is Owned {
	function kill() public payable onlyOwner{
		selfdestruct(payable(owner));
	}
}


contract Faucet is Mortal {

    IERC20 public token;
    
    uint256 private lockTime = 1 minutes;
    uint256 private withdrawalAmount = 10 * (10**18);

    mapping(address => uint256) private nextAccessTime;

    event Withdrawal(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    constructor(address tokenAddress) payable {
        token = IERC20(tokenAddress);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this)) / (10**18);
    }

    function getwithdrawalAmount() external view returns (uint256){
        return withdrawalAmount / (10**18);
    }

    function getLockTime() external view returns (uint256){
        return lockTime / 60;
    }

    function requestTokens() public {
        require(
            token.balanceOf(address(this)) >= withdrawalAmount,
            "Insufficient balance in faucet"
        );
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Insufficient time elapsed since last withdrawal"
        );

        nextAccessTime[msg.sender] = block.timestamp + lockTime;
        bool success = token.transfer(msg.sender, withdrawalAmount);
        require(success, "Transfer failed");
    }
    
    function withdraw() external payable onlyOwner {
        emit Withdrawal(msg.sender, token.balanceOf(address(this)));
        bool success = token.transfer(msg.sender, token.balanceOf(address(this)));
        require(success, "Transfer failed");
    }

    function setWithdrawalAmount(uint256 amount) public payable onlyOwner {
        withdrawalAmount = amount * (10**18);
    }

    function setLockTime(uint256 amount) public payable onlyOwner {
        lockTime = amount * 1 minutes;
    }

}
