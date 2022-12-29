import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Local network detected! Deploying libs...");

  log("Deploying AddressArrayUtils...");

  const addressArrayUtils = await deploy("AddressArrayUtils", {
    from: deployer,
    log: true,
    args: [],
  });

  log("Deploying StringArrayUtils...");

  const stringArrayUtils = await deploy("StringArrayUtils", {
    from: deployer,
    log: true,
    args: [],
  });

  log("Deploying UintArrayUtils...");

  const uintArrayUtils = await deploy("UintArrayUtils", {
    from: deployer,
    log: true,
    args: [],
  });

  log("Deploying Class...");

  const classes = await deploy("ClassLibrary", {
    from: deployer,
    log: true,
    args: [],
  });

  log("Deploying Stats...");

  const stats = await deploy("StatsLibrary", {
    from: deployer,
    log: true,
    args: [],
    libraries: {
      ClassLibrary: classes.address,
    },
  });
};

deploy.tags = ["all", "libs"];

export default deploy;
