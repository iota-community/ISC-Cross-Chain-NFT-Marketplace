const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');


async function setTrustedRemote(myONFTAddress ,remoteAddress, chainId) {
    
    const MyONFT = await ethers.getContractFactory("MyONFT721");
    const myONFT = MyONFT.attach(myONFTAddress);

    // Call setTrustedRemote on the contract
    const tx = await myONFT.setTrustedRemoteAddress(chainId, remoteAddress);
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`Set trusted remote for chainId ${chainId} to address ${remoteAddress}`);
}

// Example usage
async function main() {

    const myONFTAdressPath = path.join(__dirname, 'addresses', 'MyONFT721_Bnb.txt');
    const myONFTAddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Iota.txt');


    const myONFTAdress = fs.readFileSync(myONFTAdressPath, 'utf8').trim();
    // Read the MyONFT721 address from the file to use as the remoteAddress
    const remoteAddress = fs.readFileSync(myONFTAddressPath, 'utf8').trim();

    const chainId = 10230; 

    await setTrustedRemote(myONFTAdress,remoteAddress, chainId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });