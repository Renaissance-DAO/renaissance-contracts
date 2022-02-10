import { ethers, hardhatArguments, run } from "hardhat";

async function main() {
  const { chainId } = await ethers.provider.getNetwork();
  const [deployer] = await ethers.getSigners();
  const daoAddress = deployer.address; //"0x511fEFE374e9Cb50baF1E3f2E076c94b3eF8B03b";
  const paletteAddress = deployer.address; //"0x97A61c103397634D2470F9d3CBeeC732a3393c7a";

  const DAI = await ethers.getContractFactory("DAI");
  const dai = await DAI.deploy(chainId);
  await dai.deployed();
  console.log("dai address: ", dai.address);

  // Deploy FRAX: stable coin.
  const FRAX = await ethers.getContractFactory("FRAX");
  const frax = await FRAX.deploy(chainId);
  await frax.deployed();
  console.log("frax address: ", frax.address);

  const daiAddress = dai.address; //"0xe3520349f477a5f6eb06107066048508498a291b";
  const fraxAddress = frax.address; //"0xE4B9e004389d91e4134a28F19BD833cBA1d994B6";
  // Deploy RenaissanceAuthority which handles access control of contracts.
  const RenaissanceAuthority = await ethers.getContractFactory(
    "RenaissanceAuthority"
  );
  const renaissanceAuthority = await RenaissanceAuthority.deploy(
    deployer.address,
    deployer.address,
    deployer.address
  );
  await renaissanceAuthority.deployed();
  console.log("RenaissanceAuthority: ", renaissanceAuthority.address);

  // Deploy ART
  const ART = await ethers.getContractFactory("Art");
  const art = await ART.deploy(renaissanceAuthority.address);
  await art.deployed();
  console.log("Art ERC20: ", art.address);

  // Deploy TREASURY
  const Treasury = await ethers.getContractFactory("RenaissanceTreasury");
  const treasury = await Treasury.deploy(
    art.address,
    daiAddress,
    fraxAddress,
    daoAddress, // dao
    720000,
    renaissanceAuthority.address
  );
  await treasury.deployed();
  console.log("Treasury: ", treasury.address);

  // Deploy Bonding Calculator
  const BondingCalculator = await ethers.getContractFactory(
    "RenaissanceBondingCalculator"
  );
  const bondingCalculator = await BondingCalculator.deploy(art.address);
  await bondingCalculator.deployed();
  console.log("BondingCalculator: ", bondingCalculator.address);

  // Deploy aArtERC20.
  const AART = await ethers.getContractFactory("aArt");
  const aart = await AART.deploy();
  await aart.deployed();
  console.log("aArt: ", aart.address);

  // Deploy aArtPresale.
  const AARTPresale = await ethers.getContractFactory("aArtPresale");
  const aartPresale = await AARTPresale.deploy(
    aart.address,
    art.address,
    daiAddress,
    fraxAddress,
    daoAddress,
    paletteAddress
  );
  await aartPresale.deployed();
  console.log("aArtPresale: ", aartPresale.address);

  // Presale Initialization.
  // Setting mint control to presale.
  await aart.setPresale(aartPresale.address);
  // await aart.transferOwnership(daoAddress);

  // Setting vault authority to treasury.
  await renaissanceAuthority.pushVault(treasury.address, true);
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
