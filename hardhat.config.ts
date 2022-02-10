import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";

import "./tasks/dev";
import "./tasks/presale";
import { HardhatUserConfig } from "hardhat/types";

// import "./tasks/dev";
// import "./tasks/presale";

const hardhatConfig: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
    ],
  },
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: +process.env.AURORA_LOCAL_CHAINID!,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    aurora_testnet: {
      url: process.env.AURORA_TEST_URI,
      chainId: +process.env.AURORA_TEST_CHAINID!,
      accounts: [process.env.AURORA_TEST_PRIVATE_KEY!],
      timeout: 600000,
      //`0x${process.env.AURORA_TEST_PRIVATE_KEY}` ,
      // gasPrice: 2000000000,
      // gas: 8000000,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 4,
      accounts: [process.env.AURORA_TEST_PRIVATE_KEY!],
      timeout: 600000,
      //`0x${process.env.AURORA_TEST_PRIVATE_KEY}` ,
      // gasPrice: 2000000000,
      // gas: 8000000,
    },
    aurora_main: {
      url: process.env.AURORA_MAIN_URI,
      chainId: +process.env.AURORA_MAIN_CHAINID!,
      accounts: [process.env.AURORA_TEST_PRIVATE_KEY!],
      timeout: 600000,
    },
  },
};
export default hardhatConfig;
