const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function createListing(marketplaceAddress, myERC721Address, tokenId, price) {
    // Attach to the deployed MyERC721 contract
    const NFTMarketPlace =  await ethers.getContractFactory("NFTMarketPlace");
    const marketplace =  await NFTMarketPlace.attach(marketplaceAddress);

    // Approve the marketplace to transfer the NFT
    const tx = await marketplace.listItem(myERC721Address, tokenId, price);
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`Created listing for tokenId ${tokenId} with price ${price}`);
}

async function main() {
    // Load the marketplace address
    const marketplaceAddressPath = path.join(__dirname, 'addresses', 'NFTMarketplace.txt');
    const marketplaceAddress = fs.readFileSync(marketplaceAddressPath, 'utf8').trim();

    // Load the MyERC721 contract address
    const myERC721AddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Iota.txt');
    const myERC721Address = fs.readFileSync(myERC721AddressPath, 'utf8').trim();

    // Specify the tokenId you want to approve for transfer
    const tokenId = "0"; // Example token ID, change this to the actual token ID you want to approve
    const price = 1;

    await createListing(marketplaceAddress, myERC721Address, tokenId, price);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });