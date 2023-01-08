import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { World__factory } from "../types";
import { SnapshotManager } from "../utils/snapshot";

const init = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();

  const signer = await ethers.getSigner(deployer);

  const world = await deployments.get("World");
  const player = await deployments.get("Player");
  const manaReserve = await deployments.get("ManaReserve");
  const mana = await deployments.get("MANAx");
  const currency = await deployments.get("Currency");

  log(`Initializing World...`);

  const worldContract = World__factory.connect(world.address, signer);
  await worldContract.initialize(
    player.address,
    mana.address,
    manaReserve.address,
    currency.address
  );

  log(`World initialized.`);
};

export default init;

export const snapshot = new SnapshotManager();

init.tags = ["all", "init"];
