import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat.config";
import verify from "../utils/verify";

export const CONTRACT = "Currency";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const accounts = await ethers.getSigners();

  log(`Deploying ${CONTRACT} and waiting for confirmations...`);

  const config = networkConfig[network.config.chainId!];

  const world = await deployments.get("World");
  const currencyDeployment = await deploy(CONTRACT, {
    from: deployer,
    args: [world.address, config.vatPercentage],
    log: true,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(currencyDeployment.address, []);
  }
};

export default deploy;
deploy.tags = ["all", "currency"];
