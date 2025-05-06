const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function deployCrossChainToken(lzEndpointAddress) {
    const MyCrossChainToken = await ethers.getContractFactory("CrossChainToken");
    const myCrossChainToken = await MyCrossChainToken.deploy(lzEndpointAddress);

    const address = await myCrossChainToken.getAddress();
    console.log("MyCrossChainToken deployed to:", address);
    return address;
}

async function main() {
    const lzEndpointAddress = "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1"; // Endpoint on Iota
    
    const deployedAddress = await deployCrossChainToken(lzEndpointAddress);

    // Save the contract address to a file for easy access
    const addressDirectory = path.join(__dirname, 'addresses');
    fs.mkdirSync(addressDirectory, { recursive: true });

    const filePath = path.join(addressDirectory, 'CrossChainToken_Iota.txt');
    fs.writeFileSync(filePath, deployedAddress);

    console.log(`Contract address written to ${filePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });