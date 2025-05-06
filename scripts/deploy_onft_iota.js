const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function deployMyONFT721(name, symbol, minGasToTransfer,lzEndpointAddress) {
    const MyProxyONFT721 = await ethers.getContractFactory("MyONFT721");
    const myProxyONFT721 = await MyProxyONFT721.deploy(name, symbol, minGasToTransfer,lzEndpointAddress);

    const address = await myProxyONFT721.getAddress();
    console.log("MyONFT721 deployed to:", address);
    return address;
}

async function main() {
    const minGasToTransfer = 100000; // Example value, adjust based on your needs
    const lzEndpointAddress = "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1"; 

    const name = "SampleToken";
    const symbol = "SESA";
    
    const deployedAddress = await deployMyONFT721(name, symbol, minGasToTransfer, lzEndpointAddress);

    // Save the contract address to a file for easy access
    const addressDirectory = path.join(__dirname, 'addresses');
    fs.mkdirSync(addressDirectory, { recursive: true });

    const filePath = path.join(addressDirectory, 'MyONFT721_Shimmer.txt');
    fs.writeFileSync(filePath, deployedAddress);

    console.log(`Contract address written to ${filePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });