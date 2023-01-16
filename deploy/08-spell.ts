import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat.config";
import verify from "../utils/verify";

export const CONTRACT = "Spell";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const addressArrayUtils = await deployments.get("AddressArrayUtils");
  const stringArrayUtils = await deployments.get("StringArrayUtils");
  const uintArrayUtils = await deployments.get("UintArrayUtils");

  const classLibrary = await deployments.get("ClassLibrary");
  const statsLibrary = await deployments.get("StatsLibrary");

  const player = await deployments.get("Player");
  const spellRegistry = await deployments.get("SpellRegistry");

  const args: any[] = [player.address, spellRegistry.address];

  log(`Deploying ${CONTRACT} and waiting for confirmations...`);

  const spell = await deploy(CONTRACT, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
    libraries: {
      AddressArrayUtils: addressArrayUtils.address,
      StringArrayUtils: stringArrayUtils.address,
      UintArrayUtils: uintArrayUtils.address,
      ClassLibrary: classLibrary.address,
      StatsLibrary: statsLibrary.address,
    },
  });

  log(`${CONTRACT} deployed at ${spell.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(spell.address, args);
  }
};

export default deploy;
deploy.tags = ["all", "spell-registry"];
