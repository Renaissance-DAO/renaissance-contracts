require("@nomiclabs/hardhat-web3");

// List of addresses deployed to Hardhat Network.
// Edit the addresses below if the deployed addresses are different.
const FRAX_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const A_ART_PRESALE_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);
    console.log(`"Account: ${account} Balance: ${balance}`);
  });

task("mint-frax", "Mint test FRAX to an account")
  .addParam("account", "The account's address to mint and send FRAX to.")
  .addParam("amount", "Amount of FRAX to mint")
  .setAction(async (taskArgs) => {
    const fraxAmount = web3.utils.toWei(taskArgs.amount, "ether");

    const accounts = await ethers.getSigners();
    const FRAX = await ethers.getContractFactory("FRAX");
    const frax = new hre.ethers.Contract(
      FRAX_ADDRESS,
      FRAX.interface,
      accounts[0]
    );

    await frax.mint(taskArgs.account, fraxAmount);
    console.log(
      `Minted ${taskArgs.amount} FRAX to Address ${taskArgs.account}`
    );
  });

task("start-sale", "Start presale").setAction(async () => {
  const [account0] = await ethers.getSigners();
  const A_ART_PRESALE = await ethers.getContractFactory("aArtPresale");
  const aArtPresale = new hre.ethers.Contract(
    A_ART_PRESALE_ADDRESS,
    A_ART_PRESALE.interface,
    account0
  );

  await aArtPresale.start();
  console.log("Started presale");
});

task("whitelist-user", "whitelist a user for presale")
  .addParam("account", "The account's address to whitelist")
  .setAction(async (taskArgs) => {
    const [account0] = await ethers.getSigners();
    const A_ART_PRESALE = await ethers.getContractFactory("aArtPresale");
    const aArtPresale = new hre.ethers.Contract(
      A_ART_PRESALE_ADDRESS,
      A_ART_PRESALE.interface,
      account0
    );

    await aArtPresale.addWhitelist(taskArgs.account);
    console.log("whitelisted user");
  });

module.exports = {};
