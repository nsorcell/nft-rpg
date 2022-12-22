import { parseEther } from "ethers/lib/utils";

export type NetworkConfig = {
  name: string;
  chain: "polygon";
};

export interface NetworkConfigInfo {
  [key: number]: NetworkConfig;
}

const price = parseEther("0.088");

export const networkConfig: NetworkConfigInfo = {
  137: {
    name: "matic",
    chain: "polygon",
  },
  80001: {
    name: "mumbai",
    chain: "polygon",
  },
  31337: {
    name: "hardhat",
    chain: "polygon",
  },
};

export const developmentChains = ["hardhat", "localhost"];
export const testnetChains = ["mumbai"];
export const productionChains = ["matic"];
