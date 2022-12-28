import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat.config";
import verify from "../utils/verify";

export const CONTRACT = "ManaReserve";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const world = await deployments.get("World");

  const args: any[] = [world.address];

  log(`Deploying ${CONTRACT} and waiting for confirmations...`);

  const manaReserve = await deploy(CONTRACT, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
  });

  log(`${CONTRACT} deployed at ${manaReserve.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(manaReserve.address, args);
  }
};

export default deploy;
deploy.tags = ["all", "world"];
