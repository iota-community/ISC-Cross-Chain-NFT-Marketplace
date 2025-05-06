const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

// Function to set a trusted remote on the MyONFT721 contract
async function setMinDstGas(proxyONFTAddress, chainId, minDstGas) {
    // Attach to the deployed MyONFT721 contract
    const myONFT721 = await ethers.getContractFactory("MyONFT721");
    const MyONFT721 = myONFT721.attach(proxyONFTAddress);

    // Call setMinDstGas on the contract
    let tx = await MyONFT721.setMinDstGas(chainId, 0, minDstGas, );
    await tx.wait(); // Wait for the transaction to be mined

    // Call setMinDstGas on the contract
    let tx_2 = await MyONFT721.setMinDstGas(chainId, 1, minDstGas);
    await tx_2.wait(); // Wait for the transaction to be mined

    console.log(`Set min dist gas limit for chainId ${chainId}`);
}
// Example usage
async function main() {

    const proxyAddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Shimmer.txt');

    // Read the MyONFT721 address from the file
    const MyONFT721Address = fs.readFileSync(proxyAddressPath, 'utf8').trim();
   
    const bnbchainId = 10102; 

    const minDstGas = 100500;

    await setMinDstGas(MyONFT721Address, bnbchainId, minDstGas);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });