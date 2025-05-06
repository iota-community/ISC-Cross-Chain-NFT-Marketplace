const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function approveNFTTransfer(marketplaceAddress, myERC721Address, tokenId) {
    // Attach to the deployed MyERC721 contract
    const MyERC721 = await ethers.getContractFactory("MyERC721");
    const myERC721 = await MyERC721.attach(myERC721Address);

    // Approve the marketplace to transfer the NFT
    const tx = await myERC721.approve(marketplaceAddress, tokenId);
    await tx.wait(); // Wait for the transaction to be mined

    console.log(`Approved marketplace at address ${marketplaceAddress} to transfer tokenId ${tokenId}`);
}

async function main() {
    // Load the marketplace address
    const marketplaceAddressPath = path.join(__dirname, 'addresses', 'MarketplaceV2_Iota.txt');
    const marketplaceAddress = fs.readFileSync(marketplaceAddressPath, 'utf8').trim();

    // Load the MyERC721 contract address
    const myERC721AddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Iota.txt');
    const myERC721Address = fs.readFileSync(myERC721AddressPath, 'utf8').trim();

    // Specify the tokenId you want to approve for transfer
    const tokenId = 1; // Example token ID, change this to the actual token ID you want to approve

    await approveNFTTransfer(marketplaceAddress, myERC721Address, tokenId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });