import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat.config";
import { PrimaryClass, SecondaryClass } from "../utils/player-utils";
import verify from "../utils/verify";

export const CONTRACT = "SpellRegistry";

const primaryClassContracts = Object.keys(PrimaryClass).filter(
  (key) => isNaN(Number(key)) && key !== "None"
);
const secondaryClassContracts = Object.keys(SecondaryClass).filter(
  (key) => isNaN(Number(key)) && key !== "None"
);

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const primaryClassDeployments = await Promise.all(
    primaryClassContracts.map(async (className) =>
      deployments.get(`${className}Spells`)
    )
  );

  const secondaryClassDeployments = await Promise.all(
    secondaryClassContracts.map((className) =>
      deployments.get(`${className}Spells`)
    )
  );

  const addressArrayUtils = await deployments.get("AddressArrayUtils");
  const classLibrary = await deployments.get("ClassLibrary");
  const statsLibrary = await deployments.get("StatsLibrary");

  const args: any[] = [
    primaryClassDeployments.map((deployment) => deployment.address),
    secondaryClassDeployments.map((deployment) => deployment.address),
  ];

  log(`Deploying ${CONTRACT} and waiting for confirmations...`);

  const spellRegistry = await deploy(CONTRACT, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
    libraries: {
      AddressArrayUtils: addressArrayUtils.address,
      ClassLibrary: classLibrary.address,
      StatsLibrary: statsLibrary.address,
    },
  });

  log(`${CONTRACT} deployed at ${spellRegistry.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(spellRegistry.address, args);
  }
};

export default deploy;
deploy.tags = ["all", "spell-registry"];
