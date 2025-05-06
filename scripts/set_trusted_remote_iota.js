const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function setTrustedRemote(remoteAddress ,myONFT721Address, chainId) {

    const MyONFT721 = await ethers.getContractFactory("MyONFT721");
    const myONFT721 = MyONFT721.attach(myONFT721Address);

    // Call setTrustedRemote on the contract
    const tx = await myONFT721.setTrustedRemoteAddress(chainId, remoteAddress);
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`Set trusted remote for chainId ${chainId} to address ${myONFT721Address}`);
}

// Example usage
async function main() {

    const bnbONFTPath = path.join(__dirname, 'addresses', 'MyONFT721_Bnb.txt');
    const myONFTAddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Iota.txt');

    const remoteAddress = fs.readFileSync(bnbONFTPath, 'utf8').trim();
    // Read the MyONFT721 address from the file to use as the myONFT721Address
    const myONFT721Address = fs.readFileSync(myONFTAddressPath, 'utf8').trim();

    const chainId = 10102; 

    await setTrustedRemote(remoteAddress,myONFT721Address, chainId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });