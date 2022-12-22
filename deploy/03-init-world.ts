import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { World__factory } from "../types";

const init = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();

  const signer = await ethers.getSigner(deployer);

  const world = await deployments.get("World");
  const player = await deployments.get("Player");
  const manaReserve = await deployments.get("ManaReserve");
  const mana = await deployments.get("MANAx");

  log(`Initializing World...`);

  const worldContract = World__factory.connect(world.address, signer);
  await worldContract.initialize(
    player.address,
    mana.address,
    manaReserve.address
  );

  log(`World initialized.`);
};

export default init;
init.tags = ["all", "init"];
