require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("./dev-scripts/tasks")

module.exports =  {
  solidity: {
    compilers: [
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
      {
        version: '0.7.5',
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: +process.env.AURORA_LOCAL_CHAINID
    },
    aurora_test: {
      url: process.env.AURORA_TEST_URI,
      chainId: +process.env.AURORA_TEST_CHAINID,
      accounts: [`0x${process.env.AURORA_TEST_PRIVATE_KEY}`],
      live: true,
      saveDeployments: true,
      tags: ['aurora_testnet'],
      gasPrice: 2000000000,
      gas: 8000000
    },
    aurora_main: {
      url: process.env.AURORA_MAIN_URI,
      chainId: +process.env.AURORA_MAIN_CHAINID,
      accounts: [`0x${process.env.AURORA_MAIN_PRIVATE_KEY}`],
      live: true,
      saveDeployments: true,
      tags: ['aurora'],
      gasPrice: 2000000000,
      gas: 8000000
    }
  }
};
