import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { writeFileSync } from "fs";
import virtuosos from "../scripts/json/virtuoso1";
import maestros from "../scripts/json/maestro1";

const FRAX_ADDRESS = "0xD13F312EA12708A942994f04F1F1d2D86b430ddD";

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const account = hre.ethers.utils.getAddress(taskArgs.account);
    const balance = await hre.ethers.provider.getBalance(account);
    console.log(`"Account: ${account} Balance: ${balance}`);
  });

task("mint-frax", "Mint test FRAX to an account")
  .addParam("account", "The account's address to mint and send FRAX to.")
  .addParam("amount", "Amount of FRAX to mint")
  .setAction(async (taskArgs, hre) => {
    const fraxAmount = hre.ethers.utils.parseUnits(taskArgs.amount, "ether");

    const accounts = await hre.ethers.getSigners();
    const FRAX = await hre.ethers.getContractFactory("FRAX");
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

task("setup", "setup a testnet").setAction(async (_, { run, ethers }) => {
  const [deployer] = await ethers.getSigners();

  run("mint-frax", {
    account: deployer.address,
    amount: "1000",
  });
  run("whitelist-user", {
    account: deployer.address,
    list: "a",
  });
  run("start-sale");
});

task("check-whitelist", "check whitelist")
  // .addParam("list", "'A' or 'B'")
  .addParam("presale", "presale address")
  .setAction(async ({ presale }, { ethers }) => {
    const [deployer] = await ethers.getSigners();

    const Presale = await ethers.getContractFactory("aArtPresale");
    const presaleContract = new ethers.Contract(
      presale,
      Presale.interface,
      deployer
    );

    let virtuososMissing = [];
    let virtuososProcessed = 0;
    for (const virtuoso of virtuosos) {
      virtuososProcessed++;
      const isWhitelisted = await presaleContract.whitelistedA(virtuoso);
      if (!isWhitelisted) {
        virtuososMissing.push(virtuoso);
        console.log(`virtuoso: ${virtuoso} not whitelisted`);
      } else
        console.log(
          `process virtuoso ${virtuososProcessed}/${virtuosos.length}`
        );
    }

    let maestrosMissing = [];
    let maestrosProcessed = 0;
    for (const maestro of maestros) {
      maestrosProcessed++;

      const isWhitelisted = await presaleContract.whitelistedB(maestro);
      if (!isWhitelisted) {
        maestrosMissing.push(maestro);
        console.log(`maestro: ${maestro} not whitelisted`);
      } else {
        console.log(`process maestro ${maestrosProcessed}/${maestros.length}`);
      }
    }

    writeFileSync(
      "./tasks/errors.json",
      JSON.stringify({
        virtuososMissing,
        maestrosMissing,
      })
    );
  });
