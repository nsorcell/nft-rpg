import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SUPER_TOKEN_FACTORY } from "../config/contracts";
import { developmentChains } from "../helper-hardhat.config";
import { MANAx__factory } from "../types";
import verify from "../utils/verify";

export const CONTRACT = "MANAx";
export const SYMBOL = "MPX";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const accounts = await ethers.getSigners();

  log(`Deploying ${CONTRACT} and waiting for confirmations...`);

  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545",
    5
  );

  // const world = await deployments.get("World");
  const manaReserve = await deployments.get("ManaReserve");
  // const worldSigner = await ethers.getImpersonatedSigner(world.address);

  // const tx = {
  //   to: world.address,
  //   value: ethers.utils.parseEther("100"),
  // };

  // await provider.send(tx, []);
  const args: any[] = [];
  const manaDeployment = await deploy(CONTRACT, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(manaDeployment.address, args);
  }

  const resource = MANAx__factory.connect(manaDeployment.address, accounts[0]);

  const txn = await resource.initialize(
    SUPER_TOKEN_FACTORY,
    CONTRACT,
    SYMBOL,
    ethers.constants.MaxInt256,
    manaReserve.address,
    "0x"
  );

  await txn.wait();
};

export default deploy;
deploy.tags = ["all", "resources"];
