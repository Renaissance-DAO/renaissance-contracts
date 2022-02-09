import {ethers} from 'hardhat';
import virtuoso1 from './json/virtuoso1.json';
import virtuoso2 from './json/virtuoso2.json';
import virtuoso3 from './json/virtuoso3.json';
import maestro1 from './json/maestro1.json';

// Delaying as for some reason tx.wait() did not fix issues with testnet deployment
function delay(ms) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {

    const presaleAddress = ""
    const daoAddress = "0x511fEFE374e9Cb50baF1E3f2E076c94b3eF8B03b"
    
    const Presale = await ethers.getContractFactory('aArtPresale');
    const presale = await Presale.attach(presaleAddress)
    // Public Whitelist
    console.log('0/6 virtuoso chunks...');
    await presale.addMultipleWhitelistA(virtuoso1);
    console.log('tx sent');
    await delay(15000);
    console.log('1/6 virtuoso chunks...');
    await presale.addMultipleWhitelistA(virtuoso2);
    console.log('tx sent');
    await delay(15000);
    console.log('2/6 virtuoso chunks...');
    await presale.addMultipleWhitelistA(virtuoso3);
    console.log('tx sent');
    await delay(15000);
    console.log('3/6 maestro chunks...');
    await presale.addMultipleWhitelistB(maestro1);
    console.log('tx sent');
    await delay(15000);

    // Team Whitelist
    await presale.addTeam(daoAddress);

    await presale.start()
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
