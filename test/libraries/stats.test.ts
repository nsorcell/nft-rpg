import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import fs from "fs";
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

  const points = level * 3;

  const _stats = {
    ...initialStats,
    [primaryStat]: initialStats[primaryStat] + Math.ceil(points / 2),
    [secondaryStat]: initialStats[secondaryStat] + Math.floor(points / 3),
  };

  const stats = {
    ..._stats,
    constitution: _stats["constitution"] + Math.floor(points / 6),
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

const generateStatsFor = async (statsLib: StatsLibrary, level: number) =>
  (
    await Promise.all(
      classCombinations.map(
        async (
          [primaryClass, secondaryClass, primaryStat, secondaryStat],
          i
        ) => {
          const { stats, attributes } = getClassStatsWithDistribution(
            level,
            primaryClass,
            secondaryClass,
            primaryStat,
            secondaryStat
          );

          const health = await statsLib.calculateHealth(
            createStatsArray(stats)
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
            createStatsArray(stats)
          );

          const mDef = await statsLib.calculateMagicDefense(
            createStatsArray(stats)
          );

          const pCritP = await statsLib.calculatePhysicalCritChance(
            createStatsArray(stats),
            createAttributesArray(attributes)
          );

          const mCritP = await statsLib.calculateMagicCritChance(
            createStatsArray(stats),
            createAttributesArray(attributes)
          );

          return {
            className: SecondaryClass[secondaryClass],
            health: health.toString(),
            pAtk: pAtk.toString(),
            mAtk: mAtk.toString(),
            pDef: pDef.toString(),
            mDef: mDef.toString(),
            pCritP: pCritP.toString(),
            mCritP: mCritP.toString(),
            stats,
          };
        }
      )
    )
  ).reduce((acc, { className, ...rest }) => {
    return {
      ...acc,
      [className]: {
        ...rest,
      },
    };
  }, {});

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
      const lvl1 = await generateStatsFor(statsLib, 1);
      const lvl5 = await generateStatsFor(statsLib, 5);
      const lvl10 = await generateStatsFor(statsLib, 10);
      const lvl15 = await generateStatsFor(statsLib, 15);
      const lvl20 = await generateStatsFor(statsLib, 20);

      fs.writeFileSync(`lvl1.json`, JSON.stringify(lvl1));
      fs.writeFileSync(`lvl5.json`, JSON.stringify(lvl5));
      fs.writeFileSync(`lvl10.json`, JSON.stringify(lvl10));
      fs.writeFileSync(`lvl15.json`, JSON.stringify(lvl15));
      fs.writeFileSync(`lvl20.json`, JSON.stringify(lvl20));
    });
  });
});
