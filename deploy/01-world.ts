import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat.config";
import verify from "../utils/verify";

export const CONTRACT = "World";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const config = networkConfig[network.config.chainId!];

  const args: any[] = [config.currencyRatio];

  log(`Deploying ${CONTRACT} and waiting for confirmations...`);


  const abdk = await deploy("ABDKMath64x64", {
    from: deployer,
    log: true,
    args: []
  });

  const perlin = await deploy("Perlin", {
    from: deployer,
    log: true,
    args: [],
    libraries: {
      ABDKMath64x64: abdk.address
    }
  });

  const world = await deploy(CONTRACT, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
    libraries: {
      Perlin: perlin.address
    }
  });

  log(`${CONTRACT} deployed at ${world.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(world.address, args);
  }
};

export default deploy;
deploy.tags = ["all", "world"];
