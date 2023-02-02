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

  log("Deploying Hex...");

  const hexUtils = await deploy("HexUtils", {
    from: deployer,
    log: true,
    args: [],
  });

  log("Deploying Perlin...");

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

  // const mulberry = await deploy("Mulberry", {
  //   from: deployer,
  //   log: true,
  //   args: [],
  //   libraries: {
  //     ABDKMath64x64: abdk.address
  //   }
  // });

  // const simplex = await deploy("Simplex", {
  //   from: deployer,
  //   log: true,
  //   args: [0],
  //   libraries: {
  //     Mulberry: mulberry.address,
  //     ABDKMath64x64: abdk.address
  //   },
  //   gasLimit: 30000000-1
  // });
};

deploy.tags = ["all", "libs"];

export default deploy;
