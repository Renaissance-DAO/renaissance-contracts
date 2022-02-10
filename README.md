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
RenaissanceAuthority:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Art:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
DAI:  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
FRAX:  0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
Treasury:  0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
BondingCalculator:  0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
aArt:  0x0165878A594ca255338adfa4d48449f69242Eb8F
aArtPresale:  0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
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
