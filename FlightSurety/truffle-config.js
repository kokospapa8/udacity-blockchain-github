var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");
MNEMONIC = "";
ENDPOINT = "";
module.exports = {
  networks: {
    development: {
      // provider: function() {
      //   return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      // },
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 4700000,
      gasPrice: 8000000000,
    },
    rinkeby: {
      provider: function () {
        var wallet = new HDWalletProvider(MNEMONIC, ENDPOINT);
        var nonceTracker = new NonceTrackerSubprovider();
        wallet.engine._providers.unshift(nonceTracker);
        nonceTracker.setEngine(wallet.engine);
        return wallet;
      },
      network_id: 4,
      // gas: 2000000,   // <--- Twice as much
      // gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.4.25",
    },
  },
};
