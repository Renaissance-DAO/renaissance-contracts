// import * as hre from "hardhat";
import { task } from "hardhat/config";
import virtuoso1 from "../scripts/json/virtuoso1.json";
import virtuoso2 from "../scripts/json/virtuoso2.json";
import virtuoso3 from "../scripts/json/virtuoso3.json";
import maestro1 from "../scripts/json/maestro1.json";
import { chunkArray, timeout } from "../utils/tools";

task("start-sale", "Start presale")
  .addParam("presale", "presale contract address")
  .setAction(async ({ presale }, hre) => {
    const [account0] = await hre.ethers.getSigners();
    const A_ART_PRESALE = await hre.ethers.getContractFactory("aArtPresale");
    const aArtPresale = new hre.ethers.Contract(
      presale,
      A_ART_PRESALE.interface,
      account0
    );

    await aArtPresale.start();
    console.log("Started presale");
  });

task("whitelist-user", "whitelist a user for presale")
  .addParam("presale", "presale contract address")
  .addParam("account", "The account's address to whitelist")
  .addParam("list", "'A' or 'B'")
  .setAction(async ({ presale, account, list }, hre) => {
    const [account0] = await hre.ethers.getSigners();
    const A_ART_PRESALE = await hre.ethers.getContractFactory("aArtPresale");
    const aArtPresale = new hre.ethers.Contract(
      presale,
      A_ART_PRESALE.interface,
      account0
    );

    if (list) {
      list.toUpperCase() === "A"
        ? await aArtPresale.addWhitelistA(account)
        : list.toUpperCase() === "B" &&
          (await aArtPresale.addWhitelistB(account));
      console.log("whitelisted user");
    }
  });

task("whitelist-users", "whitelist users from json")
  .addParam("dao", "The address of the DAO")
  .addParam("presale", "The address of the aArt presale contract")
  .setAction(async ({ presale, dao }, { ethers,config }) => {
    const CHUNK_AMOUNT = 50;
    const [deployer] = await ethers.getSigners();

    const Presale = await ethers.getContractFactory("aArtPresale");
    const presaleContract = new ethers.Contract(
      presale,
      Presale.interface,
      deployer
    );

    // Public Whitelist
    const virtuosos = chunkArray(virtuoso1, CHUNK_AMOUNT);
    let virtuososProcessed = 0;
    for (const virtuosoChunk of virtuosos) {
      const whitelistATx = await presaleContract.addMultipleWhitelistA(
        virtuosoChunk
      );
      await whitelistATx.wait();
      virtuososProcessed += CHUNK_AMOUNT;
      console.log(
        `virtuosos 1 ${virtuososProcessed}/${virtuosos.flat().length} complete`
      );
      await timeout(15000);
      console.log("waiting 15 seconds");
    }

    const virtuosos2 = chunkArray(virtuoso2, CHUNK_AMOUNT);
    let virtuososProcessed2 = 0;
    for (const virtuosoChunk of virtuosos2) {
      const whitelistATx = await presaleContract.addMultipleWhitelistA(
        virtuosoChunk
      );
      await whitelistATx.wait();
      virtuososProcessed2 += CHUNK_AMOUNT;
      console.log(
        `virtuosos 2 ${virtuososProcessed2}/${virtuosos2.flat().length} complete`
      );
      await timeout(25000);
      console.log("waiting 25 seconds");
    }

    const virtuosos3 = chunkArray(virtuoso3, CHUNK_AMOUNT);
    let virtuososProcessed3 = 0;
    for (const virtuosoChunk of virtuosos3) {
      const whitelistATx = await presaleContract.addMultipleWhitelistA(
        virtuosoChunk
      );
      await whitelistATx.wait();
      virtuososProcessed3 += CHUNK_AMOUNT;
      console.log(
        `virtuosos 3 ${virtuososProcessed3}/${virtuosos3.flat().length} complete`
      );
      await timeout(25000);
      console.log("waiting 25 seconds");
    }

    const maestros = chunkArray(maestro1, CHUNK_AMOUNT);
    let maestrosProcessed = 0;
    for (const maestroChunk of maestros) {
      const whitelistBTx = await presaleContract.addMultipleWhitelistB(
        maestroChunk
      );
      await whitelistBTx.wait();
      maestrosProcessed += CHUNK_AMOUNT;
      console.log(
        `maestros ${maestrosProcessed}/${maestros.flat().length} complete`
      );
      await timeout(25000);
      console.log("waiting 25 seconds");
    }

    // Team Whitelist
    console.log("whitelist DAO...");
    const addTeamTx = await presaleContract.addTeam(dao);
    await timeout(25000);
    await addTeamTx.wait();

    await presaleContract.start();
    await timeout(25000);

    await presaleContract.transferOwnership(dao);
    await timeout(25000);
  });
