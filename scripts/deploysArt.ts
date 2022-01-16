const { ethers } = require("hardhat");

async function main(): Promise<void> {
    // Deploy sART
    const sART = await ethers.getContractFactory('sArtERC20Token');
    const sArt = await sART.deploy();
    await sArt.deployed()

    console.log("sART deployed at: ", sArt.address)
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})