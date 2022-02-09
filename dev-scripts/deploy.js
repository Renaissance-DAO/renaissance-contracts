require('dotenv').config();
const { ethers } = require("hardhat");

async function main(){
    const chainId = process.env.AURORA_LOCAL_CHAINID

    // Governor, Policy, Vault Addresses.
    // Wallet address created from Metamask for development purpose.
    const governorAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // multisig address
    const policyAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // multisig address
    const vaultAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // temp multisig later replaced with treasury address
    const paletteAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // multisig address

    // Deploy RenaissanceAuthority which handles access control of contracts. 
    const RenaissanceAuthority = await ethers.getContractFactory('RenaissanceAuthority');
    const renaissanceAuthority = await RenaissanceAuthority.deploy(governorAddress, policyAddress, vaultAddress);
    await renaissanceAuthority.deployed();
    console.log("RenaissanceAuthority: ", renaissanceAuthority.address);

    // Deploy ART: Renaissance governance token.
    const ART = await ethers.getContractFactory('Art');
    const art = await ART.deploy(renaissanceAuthority.address);
    await art.deployed();
    console.log("Art: ", art.address);

    // Deploy DAI: stable coin.
    const DAI = await ethers.getContractFactory('DAI');
    const dai = await DAI.deploy(chainId);
    await dai.deployed();
    console.log("DAI: ", dai.address);

    // Deploy FRAX: stable coin.
    const FRAX = await ethers.getContractFactory('FRAX');
    const frax = await FRAX.deploy(chainId);
    await frax.deployed();
    console.log("FRAX: ", frax.address);

    // Deploy Treasury.
    const Treasury = await ethers.getContractFactory('RenaissanceTreasury');
    const treasury = await Treasury.deploy(art.address, dai.address, frax.address, governorAddress, 720000, renaissanceAuthority.address);
    await treasury.deployed();
    console.log("Treasury: ", treasury.address);

    // Deploy Bonding Calculator
    const BondingCalculator = await ethers.getContractFactory('RenaissanceBondingCalculator');
    const bondingCalculator = await BondingCalculator.deploy(art.address);
    await bondingCalculator.deployed();
    console.log("BondingCalculator: ", bondingCalculator.address);

    /**
     * Deploy and Initialize Presale Contracts.
     */
    
    // Deploy aArtERC20.
    const AART = await ethers.getContractFactory('aArt');
    const aart = await AART.deploy(); 
    await aart.deployed();
    console.log("aArt: ", aart.address)

    // Deploy aArtPresale.
    const AARTPresale = await ethers.getContractFactory('aArtPresale');
    const aartPresale = await AARTPresale.deploy(aart.address, art.address, dai.address, frax.address, governorAddress, paletteAddress);
    await aartPresale.deployed();
    console.log("aArtPresale: ", aartPresale.address);

    // Presale Initialization.
    // Setting mint control to presale. 
    await aart.setPresale(aartPresale.address);
    await aart.transferOwnership(governorAddress);

    // Setting vault authority to treasury.
    await renaissanceAuthority.pushVault(treasury.address, true);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
})