// SPDX-License-Identifier:MIT
pragma solidity ^0.8.16;
import {ClassLibrary} from "./Class.sol";
import {IPlayer} from "../interfaces/tokens/IPlayer.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

library StatsLibrary {
    using SafeMath for uint256;

    enum Stats {
        STRENGTH,
        DEXTERTY,
        CONSTITUTION,
        INTELLIGENCE,
        WIT,
        LUCK
    }

    function calculatePhysicalDamage(
        uint256[6] memory stats,
        IPlayer.Attributes memory attributes,
        ClassLibrary.PrimaryClass primaryClass,
        ClassLibrary.SecondaryClass secondaryClass
    ) public pure returns (uint256) {
        if (secondaryClass == ClassLibrary.SecondaryClass.None) {
            Stats primaryStat = ClassLibrary.getPrimaryMarker(primaryClass);

            uint256 primaryStatValue = stats[uint256(primaryStat)];

            uint256 a = primaryStatValue.mul(attributes.level);
            uint256 b = attributes.level.mul(stats[uint256(Stats.STRENGTH)]);

            return a.add(b);
        } else {
            Stats[2] memory allStats = ClassLibrary.getAllMarkers(
                secondaryClass
            );

            uint256 primaryStatValue = stats[uint256(allStats[0])];
            uint256 secondaryStatValue = stats[uint256(allStats[1])];

            uint256 a = primaryStatValue.mul(attributes.level);
            uint256 b = secondaryStatValue.mul(attributes.level.div(2));
            uint256 c = attributes.level.mul(stats[uint256(Stats.STRENGTH)]);

            return a.add(b).add(c);
        }
    }

    function calculatePhysicalDefense(
        uint256[6] memory stats,
        IPlayer.Attributes memory attributes
    ) public pure returns (uint256) {
        uint256 a = stats[uint256(Stats.STRENGTH)].mul(attributes.level.div(2));
        uint256 b = stats[uint256(Stats.CONSTITUTION)].mul(attributes.level);

        return a.add(b);
    }
}
