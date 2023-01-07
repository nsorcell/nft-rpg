import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";

export type NetworkConfig = {
  name: string;
  chain: "polygon";
  vatPercentage: number;
  mintPrice: BigNumber;
  currencyRatio: number;
};

export interface NetworkConfigInfo {
  [key: number]: NetworkConfig;
}

export const networkConfig: NetworkConfigInfo = {
  5: {
    name: "matic",
    chain: "polygon",
    vatPercentage: 20,
    mintPrice: parseEther("1"),
    currencyRatio: 10,
  },
  137: {
    name: "matic",
    chain: "polygon",
    vatPercentage: 20,
    mintPrice: parseEther("1"),
    currencyRatio: 10,
  },
  80001: {
    name: "mumbai",
    chain: "polygon",
    vatPercentage: 20,
    mintPrice: parseEther("1"),
    currencyRatio: 10,
  },
  31337: {
    name: "hardhat",
    chain: "polygon",
    vatPercentage: 20,
    mintPrice: parseEther("1"),
    currencyRatio: 10,
  },
};

export const developmentChains = ["hardhat", "localhost"];
export const testnetChains = ["mumbai"];
export const productionChains = ["matic"];
