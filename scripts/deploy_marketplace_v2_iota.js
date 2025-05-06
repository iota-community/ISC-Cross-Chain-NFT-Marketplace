const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function deployMarketplace(paymentTokenAddress) {
    const Marketplace = await ethers.getContractFactory("NFTMarketPlaceV2");
    const marketplace = await Marketplace.deploy(paymentTokenAddress);

    const address = await marketplace.getAddress();
    console.log("Marketplace deployed to:", address);
    return address;
}

async function main() {
    // Read the payment token address from the file
    const filePath = path.join(__dirname, 'addresses', 'CrossChainToken_Shimmer.txt');
    const paymentTokenAddress = fs.readFileSync(filePath, 'utf8').trim();

    // Deploy the Marketplace contract
    const deployedMarketplaceAddress = await deployMarketplace(paymentTokenAddress);

    // Save the contract address to a file for easy access
    const addressDirectory = path.join(__dirname, 'addresses');
    fs.mkdirSync(addressDirectory, { recursive: true });

    const marketplaceFilePath = path.join(addressDirectory, 'MarketplaceV2_Shimmer.txt');
    fs.writeFileSync(marketplaceFilePath, deployedMarketplaceAddress);

    console.log(`Marketplace contract address written to ${marketplaceFilePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
