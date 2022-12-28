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

  describe.only("emitEvent", () => {
    it("should emit a dynamic event based on the parameters", async () => {
      const sig = "event Guild_Registry_JoinRequestAccepted(address, address)";

      const txn = await registry.emitEvent(
        sig,
        accounts[0].address,
        accounts[1].address
      );

      const abi = [
        "event Guild_Registry_JoinRequestAccepted(address, address)",
      ];
      let iface = new ethers.utils.Interface(abi);

      const txnResponse = await txn.wait();

      console.log(iface.parseLog(txnResponse.logs[0]));
    });
  });
});
