import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
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

type PrimaryClassName = keyof typeof PrimaryClass;
type SecondaryClassName = keyof typeof SecondaryClass;

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
    isAlive: true,
  };

  return { stats, attributes };
};

type CharacterParams = {
  health: string;
  pAtk: string;
  mAtk: string;
  pDef: string;
  mDef: string;
  pCritP: string;
  mCritP: string;
  stats: {
    constitution: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    wit: number;
    luck: number;
  };
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
  ).reduce<Record<SecondaryClassName, CharacterParams>>(
    (acc, { className, ...rest }) => {
      return {
        ...acc,
        [className]: {
          ...rest,
        },
      };
    },
    {} as Record<SecondaryClassName, CharacterParams>
  );

describe("StatsLibrary", () => {
  let provider: JsonRpcProvider,
    accounts: SignerWithAddress[],
    statsLib: StatsLibrary,
    player: Player;

  before(async () => {
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

  describe("calculatePhysicalDamage", () => {
    it("should return the calculated physical damage", async () => {
      const result = await generateStatsFor(statsLib, 1);

      expect(result.Reaper.pAtk).to.equal("182");
    });
  });
});
