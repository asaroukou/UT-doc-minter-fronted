const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
// const infuraKey = "fj4jll3k.....";
//
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();
const rinkebyEndpoint = fs.readFileSync(".rinkeby").toString().trim();
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: {
      port: 8545,
      gas: 8500000, // Gas sent with each transaction (default: ~6700000)
      gasPrice: 20000000000,
      network_id: 5777
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, rinkebyEndpoint);
      },
      network_id: "4"
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0" // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};
