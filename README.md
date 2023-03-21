# SolidityToken

Final project for "[Alchemy University, The Ethereum Developer Bootcamp](https://university.alchemy.com/ethereum)". Took also inspiration from the "[ERC20 Tokens by Block Explorer](https://www.youtube.com/playlist?list=PLD_RqipW0-9ugx2qLcwhRkzOhcBwUwSa4)" series.

This project aims to create a token called "SolidityToken $STK". The tokens are then distributed to users who request them from the faucet. Contracts built with [Hardhat](https://hardhat.org/). UI built with [Ethers](https://docs.ethers.org/) and [Browserify](https://browserify.org/).

| Index |
| ---   |
| [Project Layout](#project-layout) |
| [Gas optimizations](#gas-optimizations) |
| [Tests](#tests) |
| [Deploy the contracts](#deploy-the-contracts) |
| [SolidityToken Faucet UI](#soliditytoken-faucet-ui) |

## Project Layout

There are three main folders:

1. `contracts/contract` - contains the solidity contracts
2. `contracts/test` - contains test for the solidity contract of the ERC20 token
3. `stkfaucet-ui/` - contains the ui

## Gas optimizations

The following gas optimizations were implemented in the contracts.

- **x += y costs more gas than x = x + y for state variables**
  - Description: Gas can be saved by substituting the addition operator with plus-equals, same for minus
  - References:
    - [`<x> += <y>`  Costs More Gas Than `<x> = <x> + <y>` For State Variables](https://code4rena.com/reports/2022-12-caviar/#g-01-x--y-costs-more-gas-than-x--x--y-for-state-variables)
    - [StateVarPlusEqVsEqPlus.md](https://gist.github.com/IllIllI000/cbbfb267425b898e5be734d4008d4fe8)
- **Use of assembly to check for address(0)**
  - Description: By checking for `address(0)` using assembly language, you can avoid the use of more gas-expensive operations such as calling a smart contract or reading from storage. This can save 6 gas per instance.
  - Reference:
    - [EVM Codes](https://www.evm.codes/)
- **Mark payable functions guaranteed to revert when called by normal users**
  - Description: If a function modifier, like onlyOwner, is applied, the function will revert if a regular user attempts to pay it. Making the function payable will save valid callers money on gas since the compiler won't do checks to see if a payment was made.
    The extra opcodes avoided are `CALLVALUE(2)`, `DUP1(3)`, `ISZERO(3)`, `PUSH2(3)`, `JUMPI(10)`, `PUSH1(3)`, `DUP1(3)`, `REVERT(0)`, `JUMPDEST(1)`, `POP(2)` which costs an average of about 21 gas per call to the function, in addition to the extra deployment cost.
  - Reference:
    - [[G‑11]  Functions guaranteed to revert when called by normal users can be marked](https://code4rena.com/reports/2022-12-backed/#g11--functions-guaranteed-to-revert-when-called-by-normal-users-can-be-marked-payable)
    

## Tests

- Install dependencies using the following command
  ```shell
  npm install
  ```
- Add a `.env` file using either the dummy keys provided in `.env.example` or your own
- To run all the tests for the contracts, use the following command
  ```shell
  npx hardhat test --network hardhat
  ```

<img src="https://raw.githubusercontent.com/seeu-inspace/soliditytoken/main/presentation/test.png">

## Deploy the contracts

0. From the [contracts](contracts/) folder, follow the following steps
1. Use the following command to deploy `SolidityToken.sol` on the Sepolia testnet
   ```shell
   npx hardhat run --network sepolia scripts/deploySolidityToken.js
   ```
2. Copy the address displayed in the terminal as a result. Paste it in `deployFaucet.js` in
   ```JavaScript
   5: 	const contract = await Contract.deploy("ADDR-SOLIDITYTOKEN");
   ```
3. Use the following command to deploy `Faucet.sol` on the Sepolia testnet
   ```shell
   npx hardhat run --network sepolia scripts/deployFaucet.js
   ```


A version of Faucet is already deployed at [0x8e830f030a1a9094bbb6ae779879177f65a47f81](https://sepolia.etherscan.io/address/0x8e830f030a1a9094bbb6ae779879177f65a47f81) and a version of SolidityToken is deployed at [0x16e41846e3be94bd529afa9b475899bd15d88bc1](https://sepolia.etherscan.io/address/0x16e41846e3be94bd529afa9b475899bd15d88bc1) on the Sepolia testnet.

## SolidityToken Faucet UI

Host the project in the [stkfaucet-ui](stkfaucet-ui/) directory on a server. If you're using Visual Studio, you can use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.

### <ins>Browserify</ins>

`dist/bundle.js` is generated using Browserify with the following command
```shell
browserify src/index.js --standalone bundle -o dist/bundle.js
```

<img src="https://raw.githubusercontent.com/seeu-inspace/soliditytoken/main/presentation/faucet.png">
