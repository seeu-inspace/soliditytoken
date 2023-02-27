const { expect } = require("chai");
const hre = require("hardhat");

describe("SolidityToken contract", function () {
	let Contract;
	let solidityToken;
	let owner;
	let addr1;
	let addr2;
    let addr3;

	beforeEach(async function () {
		Contract = await ethers.getContractFactory("SolidityToken");
		[owner, addr1, addr2, addr3] = await hre.ethers.getSigners();

		solidityToken = await Contract.deploy();
	});

	describe("Deployment", function () {
	
		it("Should set the right owner", async function () {
			expect(await solidityToken.owner()).to.equal(owner.address);
		});

        it("Should assign the total supply of tokens to the owner", async function () {
			let ownerBalance = await solidityToken.balanceOf(owner.address);
			expect(await solidityToken.totalSupply()).to.equal(ownerBalance);
		});

	});

	describe("Transactions", function () {
		it("Should transfer tokens between accounts", async function () {
            await solidityToken.transfer(addr1.address, 50);
            let addr1Balance = await solidityToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);
            
            await solidityToken.connect(addr1).transfer(addr2.address, 50);
            let addr2Balance = await solidityToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
            
        it("Should fail if sender doesn't have enough tokens", async function () {
            let initialOwnerBalance = await solidityToken.balanceOf(owner.address);

            await expect(
                solidityToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.reverted;

            expect(await solidityToken.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );

        });
            
        it("Should update balances after transfers", async function () {
            let initialOwnerBalance = await solidityToken.balanceOf(owner.address);
            
            await solidityToken.transfer(addr1.address, 100);
            
            await solidityToken.transfer(addr2.address, 50);
            
            let finalOwnerBalance = await solidityToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
            
            let addr1Balance = await solidityToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
            
            let addr2Balance = await solidityToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
    });

    describe("Approvals", function () {

        it("Should fail if sender doesn't have enough allowance", async function () {
            await expect(
                solidityToken.connect(addr1).transferFrom(addr1.address, addr1.address, 1)
            ).to.be.reverted;
        });

        //addr1 allows addr2 to spend 100 on its behalf
        it("Should approve allowance", async function () {
            solidityToken.connect(addr1).approve(addr2.address,100);

            let addr1to2Allowance = await solidityToken.allowance(addr1.address,addr2.address);
            expect(addr1to2Allowance).to.equal(100);

        });

        //transferFrom addr1 100 to addr3 using addr2
        it("Should update balances after transfers", async function () {

            await solidityToken.transfer(addr1.address, 100);

            let addr1Balance = await solidityToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            await solidityToken.connect(addr1).approve(addr2.address, 100);

            let addr1to2Allowance = await solidityToken.allowance(addr1.address,addr2.address);
            expect(addr1to2Allowance).to.equal(100);

            await solidityToken.connect(addr2).transferFrom(addr1.address, addr3.address, 100);

            let addr2Allowance = await solidityToken.allowance(addr1.address,addr2.address);
            let addr3Balance = await solidityToken.balanceOf(addr3.address);
            expect(addr3Balance).to.equal(100);
            expect(addr2Allowance).to.equal(0);

        });

    });
});