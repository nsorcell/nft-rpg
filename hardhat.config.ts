import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

import { HardhatUserConfig } from "hardhat/config";

import dotenv from "dotenv";

dotenv.config();

export const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Goerli
export const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;

// Polygon
export const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_RPC_URL ?? "";
export const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL ?? "";

// Services
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY ?? "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      allowUnlimitedContractSize: true,
    },
    hardhat: {
      chainId: 5,
      forking: {
        url: `${GOERLI_RPC_URL}`,
      },
      allowUnlimitedContractSize: true,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 80001,
      live: true,
    },
    matic: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 137,
      live: true,
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.17" },
      { version: "0.8.16" },
      { version: "0.8.14" },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
      0: PRIVATE_KEY != undefined ? PRIVATE_KEY : 0,
    },
  },
  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  typechain: {
    outDir: "./types",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 200000,
  },
};

export default config;
