const { ethers } = require("hardhat");
const { getChainId } = require("../utils/network");

async function main(){
    // Deploy ART
    const ART = await ethers.getContractFactory('ArtERC20Token');
    const art = await ART.deploy();
    await art.deployed()
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})