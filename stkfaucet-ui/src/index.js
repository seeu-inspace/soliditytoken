const { ethers } = require("./ether.js");

function connected(accounts, chainId){
	
	//make sure it's connected to Sepolia
	if(chainId != "0xaa36a7"){
		document.getElementById("request-tokens").disabled = true;
	} else {
		document.getElementById("request-tokens").disabled = false;
	}

	document.getElementById("connect-wallet").innerHTML = "Connected!";
	document.getElementById("addr-input").value = accounts[0];

	console.log("Wallet connected: " + accounts[0]);
	console.log("Chain connected: " + chainId);	

}

async function init(){

	document.getElementById("request-tokens").disabled = true;

	if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
		let accounts = await ethereum.request({method: 'eth_accounts'});
		let chainId = await ethereum.request({ method: "eth_chainId" });

		if (accounts.length) {
			connected(accounts, chainId);
		} else {
			console.log("Metamask is not connected");
		}

	} else {
	    document.getElementById("connect-wallet").innerHTML = "Please install MetaMask";
	}
}

async function connect(){
	if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
		try {
			await ethereum.request({ method: "eth_requestAccounts" });
			let accounts = await ethereum.request({ method: "eth_accounts" });
			let chainId = await ethereum.request({ method: "eth_chainId" });

			if (accounts.length) {
				connected(accounts, chainId);
			} else {
				console.log("Metamask is not connected");
			}

		} catch (error) {
			console.log(error);
		}
	} else {
	    document.getElementById("connect-wallet").innerHTML = "Please install MetaMask";
	}
}

async function requestTokensFaucet(){
	if (typeof window != "undefined" && typeof window.ethereum != "undefined"){
		try{
			let faucetAddr = "0x8e830f030a1a9094bbb6ae779879177f65a47f81";
			let abi = [
					{
							"inputs": [],
							"name": "kill",
							"outputs": [],
							"stateMutability": "payable",
							"type": "function"
					},
					{
							"inputs": [],
							"name": "requestTokens",
							"outputs": [],
							"stateMutability": "nonpayable",
							"type": "function"
					},
					{
							"inputs": [
									{
											"internalType": "uint256",
											"name": "amount",
											"type": "uint256"
									}
							],
							"name": "setLockTime",
							"outputs": [],
							"stateMutability": "payable",
							"type": "function"
					},
					{
							"inputs": [
									{
											"internalType": "address",
											"name": "tokenAddress",
											"type": "address"
									}
							],
							"stateMutability": "payable",
							"type": "constructor"
					},
					{
							"inputs": [],
							"name": "Unauthorized",
							"type": "error"
					},
					{
							"anonymous": false,
							"inputs": [
									{
											"indexed": true,
											"internalType": "address",
											"name": "from",
											"type": "address"
									},
									{
											"indexed": true,
											"internalType": "uint256",
											"name": "amount",
											"type": "uint256"
									}
							],
							"name": "Deposit",
							"type": "event"
					},
					{
							"inputs": [
									{
											"internalType": "uint256",
											"name": "amount",
											"type": "uint256"
									}
							],
							"name": "setWithdrawalAmount",
							"outputs": [],
							"stateMutability": "payable",
							"type": "function"
					},
					{
							"inputs": [],
							"name": "withdraw",
							"outputs": [],
							"stateMutability": "payable",
							"type": "function"
					},
					{
							"anonymous": false,
							"inputs": [
									{
											"indexed": true,
											"internalType": "address",
											"name": "to",
											"type": "address"
									},
									{
											"indexed": true,
											"internalType": "uint256",
											"name": "amount",
											"type": "uint256"
									}
							],
							"name": "Withdrawal",
							"type": "event"
					},
					{
							"stateMutability": "payable",
							"type": "receive"
					},
					{
							"inputs": [],
							"name": "getBalance",
							"outputs": [
									{
											"internalType": "uint256",
											"name": "",
											"type": "uint256"
									}
							],
							"stateMutability": "view",
							"type": "function"
					},
					{
							"inputs": [],
							"name": "getLockTime",
							"outputs": [
									{
											"internalType": "uint256",
											"name": "",
											"type": "uint256"
									}
							],
							"stateMutability": "view",
							"type": "function"
					},
					{
							"inputs": [],
							"name": "getwithdrawalAmount",
							"outputs": [
									{
											"internalType": "uint256",
											"name": "",
											"type": "uint256"
									}
							],
							"stateMutability": "view",
							"type": "function"
					},
					{
							"inputs": [],
							"name": "owner",
							"outputs": [
									{
											"internalType": "address",
											"name": "",
											"type": "address"
									}
							],
							"stateMutability": "view",
							"type": "function"
					},
					{
							"inputs": [],
							"name": "token",
							"outputs": [
									{
											"internalType": "contract IERC20",
											"name": "",
											"type": "address"
									}
							],
							"stateMutability": "view",
							"type": "function"
					}
			];
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			let signer = provider.getSigner();
			let contract = new ethers.Contract(faucetAddr, abi, signer);
			
			await contract.requestTokens().then(result => {
				document.getElementById("transaction-hash").innerHTML = "<td>Transaction executed: <a href=\"https://sepolia.etherscan.io/tx/" + result.hash + "\" target=_blank rel=\"nofollow\">" + result.hash + "</a></td>";
				console.log(result);
			});
			
		} catch (error) {
			document.getElementById("transaction-hash").innerHTML = "<td>Execution reverted</td>";
			console.log(error);
		}
	} else {
		document.getElementById("connect-wallet").innerHTML = "Please install MetaMask";
	}
}

module.exports = {
	init,
	connect,
	requestTokensFaucet
};