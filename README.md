## Addresses

```
// Aurora mainnet
ART_ADDRESS: "0x4Da92664A416B16335f67D670541Ec4D1F0688E5",
BONDINGCALC_ADDRESS: "0xEdc4C55E2f517acB2b22a7BA440D410723Ec7317",
TREASURY_ADDRESS: "0xfBD653f0A8E224c7C01073949A1A2ADFCea33806",
ART_FRAX_BOND_ADDRESS: "0xDBB9Dd03dbe80d62dec711d4151C6880C35dDd94",
FRAX_RESERVE_ADDRESS: "0xda2585430fef327ad8ee44af8f1f989a2a91a3d2",
DAI_RESERVE_ADDRESS: "0xe3520349f477a5f6eb06107066048508498a291b",
AART_PRESALE_ADDRESS: "0xBcf649f47d3E2F10bC26CEc444020F907334Aa41",
AART_ADDRESS: "0x318fE0ED13516934C4ea90d636bBffF615a05B55",

// Aurora testnet
ART_ADDRESS: "0x2676a7f8187a6AAB300149fC30949715A8a42b3a",
BONDINGCALC_ADDRESS: "0x9d55337183AF0EAD4f75ad061E13a098b2d3DD06",
TREASURY_ADDRESS: "0x52A4C7AC1cFEC5b466379175d2F945acd1859726",
FRAX_RESERVE_ADDRESS: "0xD13F312EA12708A942994f04F1F1d2D86b430ddD",
DAI_RESERVE_ADDRESS: "0x1b923302d578d3D00E2450dEFb1aB1459304ed0a",
AART_PRESALE_ADDRESS: "0xD02Db8093a6193dF17C6e67D0298dEC65f8c2F8e",
AART_ADDRESS: "0xC42F0fa0e805e75a5fD25662746915d6a908272C",
```
## Deployment

### Compile

npx hardhat compile

### Start a local node

Aurora local network with its chainId 1313161556.

```
npx hardhat node
```

### Deploy to a local node

```
npx hardhat run --network localhost dev-scripts/deploy.js
```

After running this command you should see following addresses deployed to local Hardhat network.

```
RenaissanceAuthority: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Art: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
DAI: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
FRAX: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
Treasury: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
BondingCalculator: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
aArt: 0x0165878A594ca255338adfa4d48449f69242Eb8F
aArtPresale: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
```

### Deployment to testnet (localhost or aurora testnet)

```
npx hardhat run --network $NETWORK_HERE scripts/deployPresale.ts && npx hardhat setup
```

## Tasks

### Whitelist users

Batch a whitelist of users

```
npx hardhat whitelist-users --network NETWORK_HERE --dao DAO_ADDRESS_HERE --presale PRESALE_ADDRESS_HERE --show-stack-traces
```

### Check whitelist

```
npx hardhat check-whitelist --presale 0xBcf649f47d3E2F10bC26CEc444020F907334Aa41 --network aurora_main
```

### Setup

Setup a local dev env after running `yarn deploy:localhost`

```
npx hardhat setup
```

### Mint FRAX in Test

You will be able to mint FRAX on test networks to dev addresses. After you have deployed FRAX contract using the deployment script above and received the contract address, you might need to change `FRAX_ADDRESS` value in `dev-scripts/tasks.js`.

Run the following command to mint FRAX to the account you want.

```
npx hardhat mint-frax --account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --amount 100 --network localhost
```
