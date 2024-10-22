import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat.config";
import { PrimaryClass, SecondaryClass } from "../utils/player-utils";
import verify from "../utils/verify";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const accounts = await ethers.getSigners();

  const primaryClassContracts = Object.keys(PrimaryClass).filter(
    (key) => isNaN(Number(key)) && key !== "None"
  );
  const secondaryClassContracts = Object.keys(SecondaryClass).filter(
    (key) => isNaN(Number(key)) && key !== "None"
  );
  const player = await deployments.get("Player");
  const stats = await deployments.get("StatsLibrary");

  log(
    `\n----------------------- Deploying PrimaryClass spells  -----------------------\n`
  );

  let nonce = await accounts[0].getTransactionCount();
  const primaryArgs: any[] = [player.address];

  await Promise.all(
    primaryClassContracts.map(async (contract, i) => {
      log(`Deploying ${contract}Spells and waiting for confirmations...`);

      const deployment = await deploy(`${contract}Spells`, {
        from: deployer,
        args: primaryArgs,
        nonce: nonce + i,
        libraries: {
          StatsLibrary: stats.address,
        },
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
      });

      log(`${contract} deployed at ${deployment.address}`);

      if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
      ) {
        await verify(deployment.address, primaryArgs);
      }

      return deployment;
    })
  );

  log(
    `\n----------------------- Deploying SecondaryClass spells -----------------------\n`
  );

  nonce = await accounts[0].getTransactionCount();
  const secondaryArgs: any[] = [player.address];

  await Promise.all(
    secondaryClassContracts.map(async (contract, i) => {
      log(`Deploying ${contract}Spells and waiting for confirmations...`);

      const deployment = await deploy(`${contract}Spells`, {
        from: deployer,
        args: secondaryArgs,
        nonce: nonce + i,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
      });

      log(`${contract} deployed at ${deployment.address}`);

      if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
      ) {
        await verify(deployment.address, secondaryArgs);
      }

      return deployment;
    })
  );
};

export default deploy;
deploy.tags = ["all", "class-spells"];
