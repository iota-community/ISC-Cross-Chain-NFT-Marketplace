const { waitForMessageReceived } = require("@layerzerolabs/scan-client");
const { ethers } = require("hardhat");
const { pack } = require("@ethersproject/solidity");
const path = require('path');
const fs = require('fs');


// Via the ProxyONFT721 contract, send erc721 tokens on the source chain (e.g. BNB testnet) to the destination chain (e.g. Iota EVM testnet)
async function sendONFT(
  proxyONFTContractAddress,
  onftContractAddress,
  lzEndpointIdOnSrcChain,
  lzEndpointIdOnDestChain,
  providedGasLimit,
  gasDropInWeiOnDestChain,
  sendingAccountPrivKey,
  receivingAccountAddress,
  nftTokenId,
  nftTokenAddress,
) {
  const sender = new ethers.Wallet(sendingAccountPrivKey, ethers.provider);

  console.log(
    `sendONFT - proxyONFTContractAddress:${proxyONFTContractAddress}, onftContractAddress:${onftContractAddress}, lzEndpointIdOnSrcChain:${lzEndpointIdOnSrcChain}, lzEndpointIdOnDestChain:${lzEndpointIdOnDestChain}, gasDropInWeiOnDestChain:${gasDropInWeiOnDestChain}, providedGasLimit:${providedGasLimit}, receivingAccountAddress:${receivingAccountAddress}, sender: ${sender.address}, nftTokenId:${nftTokenId}, nftTokenAddress:${nftTokenAddress}`,
  );

  const MyProxyONFT721Factory = await ethers.getContractFactory("MyProxyONFT721");
  const myProxyONFT721Contract = MyProxyONFT721Factory.attach(proxyONFTContractAddress);
  
  const ERC721TokenFactory = await ethers.getContractFactory("MyERC721");
  const erc721TokenContract = ERC721TokenFactory.attach(nftTokenAddress);

  // Step 1: the sender approves his erc721 tokens for the ProxyONFT721 contract
  const approveTx = await erc721TokenContract.approve(proxyONFTContractAddress, nftTokenId);
  const approveTxReceipt = await approveTx.wait();
  
  
  //console.log("sendONFT - approve tx:", approveTxReceipt?.hash);

  // const receivingAccountAddressInBytes = zeroPad(receivingAccountAddress, 32);

  // Set adapterParams with gas drop on destination
  // https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/libs/LzLib.sol#L44
  // txType 2
  // bytes  [2       32        32            bytes[]         ]
  // fields [txType  extraGas  dstNativeAmt  dstNativeAddress]
  const defaultAdapterParams = pack(
    ["uint16", "uint256", "uint256", "bytes"],
    [2, Number(providedGasLimit), Number(gasDropInWeiOnDestChain), receivingAccountAddress],
  );

  // Step 2: call the func estimateSendFee() to estimate cross-chain fee to be paid in native on the source chain
  // https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/onft721/interfaces/IONFT721Core.sol#L70
  // false is set for _payInLzToken Flag indicating whether the caller is paying in the LZ token
  const [nativeFee] = await myProxyONFT721Contract.estimateSendFee(
    lzEndpointIdOnDestChain,
    receivingAccountAddress,
    nftTokenId,
    false,
    defaultAdapterParams,
  );
  console.log("sendONFT - estimated nativeFee:", ethers.formatEther(nativeFee));

  const senderAddress = await sender.getAddress();

  // Step 3: call the func sendFrom() to transfer tokens on source chain to destination chain
  // https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/onft721/interfaces/IONFT721Core.sol#L36
  const sendTx = await myProxyONFT721Contract.sendFrom(
    senderAddress, // from
    lzEndpointIdOnDestChain,
    "0x7d0f6517DdF1D0F96a1050f1Dda7ee77323ceC0B",
    nftTokenId,
    senderAddress, // refundAddress
    "0x0000000000000000000000000000000000000000", // _zroPaymentAddress
    defaultAdapterParams,
    {
      value: nativeFee,
    },

  );
  const sendTxReceipt = await sendTx.wait();
  console.log("sendONFT - send tx on source chain:", sendTxReceipt?.hash);

  // Wait for cross-chain tx finalization by LayerZero
  console.log("Wait for cross-chain tx finalization by LayerZero ...");
  const deliveredMsg = await waitForMessageReceived(
    Number(lzEndpointIdOnDestChain),
    sendTxReceipt?.hash,
  );
  console.log("sendONFT - received tx on destination chain:", deliveredMsg?.dstTxHash);
  
}

async function main() {
  

    const proxyONFTContractAddressPath = path.join(__dirname, 'addresses', 'MyProxyONFT721.txt');
    const onftContractAddressPath = path.join(__dirname, 'addresses', 'MyONFT721_Iota.txt');

    const proxyONFTContractAddress = fs.readFileSync(proxyONFTContractAddressPath, 'utf8').trim();
    const onftContractAddress = fs.readFileSync(onftContractAddressPath, 'utf8').trim();

    const lzEndpointIdOnSrcChain = 10102;
    const lzEndpointIdOnDestChain = 10230;

    const providedGasLimit = 100000 + 6000;
    const gasDropInWeiOnDestChain = 0;

    const SENDER_ACCOUNT_PRIV_KEY = "4be05ce6dbcad7e19152b6e1e8fa708285c7c941ecd2c069cc904dd54091fde6";
    const RECEIVER_ACCOUNT_ADDRESS = "RECEIVER_ACCOUNT_ADDRESS";

    const nftTokenId = "0";
    const nftTokenAddressPath = path.join(__dirname, 'addresses', 'MyERC721_BNB.txt');
    const nftTokenAddress = fs.readFileSync(nftTokenAddressPath, 'utf8').trim();

  await sendONFT(
    proxyONFTContractAddress,
    onftContractAddress,
    lzEndpointIdOnSrcChain,
    lzEndpointIdOnDestChain,
    providedGasLimit,
    gasDropInWeiOnDestChain,
    SENDER_ACCOUNT_PRIV_KEY,
    RECEIVER_ACCOUNT_ADDRESS,
    nftTokenId,
    nftTokenAddress,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});