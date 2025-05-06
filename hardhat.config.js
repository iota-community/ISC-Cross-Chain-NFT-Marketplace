require("@nomicfoundation/hardhat-toolbox");

const BNB_TESTNET_RPC_URL = process.env.rpcUrlOnDestChain
  ? process.env.rpcUrlOnDestChain
  : "https://bsc-testnet-dataseed.bnbchain.org";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200 // Adjust the number of runs for optimization
      }
    }
  },
  
  networks: {
    'iotaevm-testnet': {
        url: 'https://json-rpc.evm.testnet.iota.cafe',
        chainId: 1076,
        accounts: ["4be05ce6dbcad7e19152b6e1e8fa708285c7c941ecd2c069cc904dd54091fde6"],
    },

    'bnbTestnet': {
      chainId: 97,
      url: BNB_TESTNET_RPC_URL,
      accounts: ["4be05ce6dbcad7e19152b6e1e8fa708285c7c941ecd2c069cc904dd54091fde6"],
    },
  }
};


