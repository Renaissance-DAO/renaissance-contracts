// import * as hre from "hardhat";
import { task } from "hardhat/config";
import virtuoso1 from "../scripts/json/virtuoso1.json";
import maestro1 from "../scripts/json/maestro1.json";
import { chunkArray, timeout } from "../utils/tools";

const A_ART_PRESALE_ADDRESS = "0xD02Db8093a6193dF17C6e67D0298dEC65f8c2F8e";

task("start-sale", "Start presale").setAction(async (_, hre) => {
  const [account0] = await hre.ethers.getSigners();
  const A_ART_PRESALE = await hre.ethers.getContractFactory("aArtPresale");
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
  .addParam("list", "'A' or 'B'")
  .setAction(async (taskArgs, hre) => {
    const [account0] = await hre.ethers.getSigners();
    const A_ART_PRESALE = await hre.ethers.getContractFactory("aArtPresale");
    const aArtPresale = new hre.ethers.Contract(
      A_ART_PRESALE_ADDRESS,
      A_ART_PRESALE.interface,
      account0  
    );

    if (taskArgs.list) {
      taskArgs.list.toUpperCase() === "A"
        ? await aArtPresale.addWhitelistA(taskArgs.account)
        : taskArgs.list.toUpperCase() === "B" &&
          (await aArtPresale.addWhitelistB(taskArgs.account));
      console.log("whitelisted user");
    }
  });

task("whitelist-users", "whitelist users from json")
  .addParam("dao", "The address of the DAO")
  .addParam("presale", "The address of the aArt presale contract")
  .setAction(async ({ presale, dao }, { ethers,config }) => {
    console.log(config)
    const CHUNK_AMOUNT = 7;
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
        `virtuosos ${virtuososProcessed}/${virtuosos.flat().length} complete`
      );
      await timeout(2000);
      console.log("waiting 2 seconds");
    }

    const maestros = chunkArray(maestro1, CHUNK_AMOUNT);
    let maestrosProcessed = 0;
    for (const virtuosoChunk of virtuosos) {
      const whitelistBTx = await presaleContract.addMultipleWhitelistB(
        virtuosoChunk
      );
      await whitelistBTx.wait();
      maestrosProcessed += CHUNK_AMOUNT;
      console.log(
        `maestros ${maestrosProcessed}/${maestros.flat().length} complete`
      );
      await timeout(2000);
      console.log("waiting 2 seconds");
    }

    // Team Whitelist
    console.log("whitelist DAO...");
    const addTeamTx = await presaleContract.addTeam(dao);
    await addTeamTx.wait();

    await presaleContract.start();
  });
