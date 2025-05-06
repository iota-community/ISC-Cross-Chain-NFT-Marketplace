const fs = require('fs');
const path = require('path');

async function main() {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketPlace");
    const marketplace = await NFTMarketplace.deploy();

    const marketplaceAddress = await marketplace.getAddress();

    console.log("NFTMarketPlace deployed to:", marketplaceAddress);

    const addressDirectory = path.join(__dirname, 'addresses');
    fs.mkdirSync(addressDirectory, { recursive: true }); // Ensure the directory exists, create it if it doesn't

    const filePath = path.join(addressDirectory, 'NFTMarketplace.txt');
    fs.writeFileSync(filePath, marketplaceAddress);

    console.log(`Contract address written to ${filePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });