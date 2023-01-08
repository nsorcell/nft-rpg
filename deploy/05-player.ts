import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat.config";
import verify from "../utils/verify";

export const CONTRACT = "Player";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const world = await deployments.get("World");
  const currency = await deployments.get("Currency");
  const lClass = await deployments.get("ClassLibrary");
  const lStats = await deployments.get("StatsLibrary");
  const lArray = await deployments.get("UintArrayUtils");

  const config = networkConfig[network.config.chainId!];

  const args: any[] = [world.address, currency.address, config.mintPrice];

  log(`Deploying ${CONTRACT} and waiting for confirmations...`);

  const player = await deploy(CONTRACT, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
    libraries: {
      StatsLibrary: lStats.address,
      ClassLibrary: lClass.address,
      UintArrayUtils: lArray.address,
    },
  });

  log(`${CONTRACT} deployed at ${player.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(player.address, args);
  }
};

export default deploy;
deploy.tags = ["all", "player"];
