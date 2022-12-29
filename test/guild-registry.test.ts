import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployments, ethers } from "hardhat";

import { GuildRegistry, GuildRegistry__factory } from "../types";

describe("GuildRegistry", () => {
  let provider: JsonRpcProvider,
    accounts: SignerWithAddress[],
    registry: GuildRegistry;

  before(async () => {
    await deployments.fixture("all");

    accounts = await ethers.getSigners();

    provider = new ethers.providers.JsonRpcBatchProvider(
      "http://localhost:8545"
    );

    const registryDeployment = await deployments.get("GuildRegistry");

    registry = GuildRegistry__factory.connect(
      registryDeployment.address,
      accounts[0]
    );
  });

  describe("", () => {});
});
