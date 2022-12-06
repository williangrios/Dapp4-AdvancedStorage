
module.exports = {
  networks: {
    development: {
     host: "localhost",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
  },

  contracts_directory: "./contracts",
  contracts_build_directory: "./frontend/src/abis",


  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",      // Fetch exact version from solc-bin
      optimizer:{
        enabled: true,
        runs: 200,
      }
    }
  }
};


