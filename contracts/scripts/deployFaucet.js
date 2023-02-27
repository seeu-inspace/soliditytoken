const hre = require("hardhat");

async function main() {
	const Contract = await hre.ethers.getContractFactory("Faucet");
	const contract = await Contract.deploy("ADDR-SOLIDITYTOKEN");

	await contract.deployed();

	console.log(
		`Contract deployed to ${contract.address}`
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
