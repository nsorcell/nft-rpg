import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat.config";
import verify from "../utils/verify";

export const CONTRACT = "GuildRegistry";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const world = await deployments.get("World");
  const addressArrayUtils = await deployments.get("AddressArrayUtils");

  const args: any[] = [];

  log(`Deploying ${CONTRACT} and waiting for confirmations...`);

  const guildRegistry = await deploy(CONTRACT, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
    libraries: {
      AddressArrayUtils: addressArrayUtils.address,
    },
  });

  log(`${CONTRACT} deployed at ${guildRegistry.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(guildRegistry.address, args);
  }
};

export default deploy;
deploy.tags = ["all", "guild-registry"];
