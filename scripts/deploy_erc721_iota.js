const fs = require('fs');
const path = require('path');

async function main() {
    const MyERC721 = await ethers.getContractFactory("MyERC721");
    const myERC721 = await MyERC721.deploy("SampleToken", "SESA", "SampleTokenURI");

    const myERC721Address = await myERC721.getAddress();

    console.log("MyERC721 deployed to:", myERC721Address);

    const addressDirectory = path.join(__dirname, 'addresses');
    fs.mkdirSync(addressDirectory, { recursive: true }); // Ensure the directory exists, create it if it doesn't

    const filePath = path.join(addressDirectory, 'MyERC721.txt');
    fs.writeFileSync(filePath, myERC721Address);

    console.log(`Contract address written to ${filePath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });