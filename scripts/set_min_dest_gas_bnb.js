const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

// Function to set a trusted remote on the MyProxyONFT721 contract
async function setMinDstGas(proxyONFTAddress, chainId, minDstGas) {
    // Attach to the deployed MyProxyONFT721 contract
    const MyProxyONFT721 = await ethers.getContractFactory("MyProxyONFT721");
    const myProxyONFT721 = MyProxyONFT721.attach(proxyONFTAddress);

    // Call setMinDstGas on the contract
    let tx = await myProxyONFT721.setMinDstGas(chainId, 0, minDstGas, );
    await tx.wait(); // Wait for the transaction to be mined

    // Call setMinDstGas on the contract
    let tx_2 = await myProxyONFT721.setMinDstGas(chainId, 1, minDstGas);
    await tx_2.wait(); // Wait for the transaction to be mined

    console.log(`Set min dist gas limit for chainId ${chainId}`);
}
// Example usage
async function main() {

    const proxyAddressPath = path.join(__dirname, 'addresses', 'MyProxyONFT721.txt');

    // Read the MyProxyONFT721 address from the file
    const myProxyONFT721Address = fs.readFileSync(proxyAddressPath, 'utf8').trim();
   
    const iotachainId = 10230; 

    const minDstGas = 100500;

    await setMinDstGas(myProxyONFT721Address, iotachainId, minDstGas);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });