import { ethers } from "hardhat";

async function main(): Promise<void> {
    // Deploy ART
    const ART = await ethers.getContractFactory('ArtERC20Token');
    const art = await ART.deploy();
    await art.deployed()

    console.log("ART deployed at: ", art.address)
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})