const fs = require('fs');
const path = require('path');

async function createNFT(myERC721Address) {

    const MyERC721 = await ethers.getContractFactory("MyONFT721");
    const myERC721 = MyERC721.attach(myERC721Address);

    // Replace the address with the address of the recipient
    const tx = await myERC721.mint("0xDC0A1c49DD32661eA013797e75f66674f6EC2C4B", 1);
    await tx.wait(); // Wait for the transaction to be mined
}

async function main() {
    // Read the contract address from the file
    const addressPath = path.join(__dirname, 'addresses', 'MyONFT721_Bnb.txt');
    const myERC721Address = fs.readFileSync(addressPath, 'utf8').trim();

    await createNFT(myERC721Address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });