import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployments, ethers } from "hardhat";
import {
  Player,
  Player__factory,
  StatsLibrary,
  StatsLibrary__factory,
} from "../../types";
import {
  AttributesInput,
  classCombinations,
  createAttributesArray,
  createStatsArray,
  PrimaryClass,
  SecondaryClass,
  StatsInput,
} from "../../utils/player-utils";

const getClassStatsWithDistribution = (
  level: number,
  primaryClass: PrimaryClass,
  secondaryClass: SecondaryClass,
  primaryStat: keyof StatsInput,
  secondaryStat: keyof StatsInput
) => {
  const initialStats: StatsInput = {
    strength: 6,
    dexterity: 6,
    constitution: 6,
    intelligence: 6,
    wit: 6,
    luck: 6,
  };

  const stats = {
    ...initialStats,
    [primaryStat]: initialStats[primaryStat] + level * 2,
    [secondaryStat]: initialStats[secondaryStat] + level * 1,
  };

  const attributes: AttributesInput = {
    level,
    experience: 0,
    primaryClass,
    secondaryClass,
    location: { x: 0, y: 0 },
    speed: 100,
  };

  return { stats, attributes };
};

describe("StatsLibrary", () => {
  let provider: JsonRpcProvider,
    accounts: SignerWithAddress[],
    statsLib: StatsLibrary,
    player: Player;

  before(async () => {
    // await deployments.fixture("all");

    accounts = await ethers.getSigners();

    provider = new ethers.providers.JsonRpcBatchProvider(
      "http://localhost:8545"
    );

    const statsDeployment = await deployments.get("StatsLibrary");
    const playerDeployment = await deployments.get("Player");

    statsLib = StatsLibrary__factory.connect(
      statsDeployment.address,
      accounts[0]
    );
    player = Player__factory.connect(playerDeployment.address, accounts[0]);
  });

  describe.only("calculatePhysicalDamage", () => {
    it("should return the calculated physical damage", async () => {
      const result = await Promise.all(
        classCombinations.map(
          async (
            [primaryClass, secondaryClass, primaryStat, secondaryStat],
            i
          ) => {
            const { stats, attributes } = getClassStatsWithDistribution(
              10,
              primaryClass,
              secondaryClass,
              primaryStat,
              secondaryStat
            );

            const pAtk = await statsLib.calculatePhysicalDamage(
              createStatsArray(stats),
              createAttributesArray(attributes)
            );

            const mAtk = await statsLib.calculateMagicDamage(
              createStatsArray(stats),
              createAttributesArray(attributes)
            );

            const pDef = await statsLib.calculatePhysicalDefense(
              createStatsArray(stats),
              createAttributesArray(attributes)
            );

            const mDef = await statsLib.cal(
              createStatsArray(stats),
              createAttributesArray(attributes)
            );

            return {
              className: SecondaryClass[secondaryClass],
              pAtk,
              mAtk,
              pDef,
              stats,
            };
          }
        )
      );
      console.log(
        result.reduce((acc, { className, pAtk, mAtk, pDef, stats }) => {
          return {
            ...acc,
            [className]: {
              pAtk,
              mAtk,
              pDef,
              stats,
            },
          };
        }, {})
      );
    });
  });
});
