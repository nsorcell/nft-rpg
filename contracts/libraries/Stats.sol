// SPDX-License-Identifier:MIT
pragma solidity ^0.8.16;
import {ClassLibrary} from "./Class.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

library StatsLibrary {
    using SafeMath for uint256;

    enum Stats {
        STRENGTH,
        DEXTERTY,
        CONSTITUTION,
        INTELLECT,
        WIT,
        LUCK,
        VOID
    }

    struct Location {
        uint256 x;
        uint256 y;
    }

    struct Attributes {
        uint256 level;
        uint256 experience;
        ClassLibrary.PrimaryClass primaryClass;
        ClassLibrary.SecondaryClass secondaryClass;
        Location location;
        uint256 speed;
    }

    function calculateXPForNextLevel(
        uint256 currentLevel
    ) internal pure returns (uint256) {
        uint256 nextLevel = currentLevel + 1;
        return nextLevel.mul(nextLevel).mul(3).add(100);
    }

    function calculatePhysicalDamage(
        uint256[6] calldata stats,
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 strength = stats[uint256(Stats.STRENGTH)];

        uint256 primaryStatMultiplier = markers[0] == Stats.STRENGTH ? 3 : 1;
        uint256 secondaryStatMultiplier = markers[1] == Stats.STRENGTH ? 2 : 1;

        uint256 a = strength.mul(primaryStatMultiplier);
        uint256 b = strength.mul(secondaryStatMultiplier);

        return (strength.mul(attributes.level)).add(a).add(b);
    }

    function calculatePhysicalDamage(
        uint256[6] calldata stats,
        uint[7] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(attributes);

        return calculatePhysicalDamage(stats, attributesStruct);
    }

    function calculateMagicDamage(
        uint256[6] calldata stats,
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 intellect = stats[uint256(Stats.INTELLECT)];

        uint256 primaryStatMultiplier = markers[0] == Stats.INTELLECT ? 3 : 1;
        uint256 secondaryStatMultiplier = markers[1] == Stats.INTELLECT ? 2 : 1;

        uint256 a = intellect.mul(primaryStatMultiplier);
        uint256 b = intellect.mul(secondaryStatMultiplier);

        return (intellect.mul(attributes.level)).add(a).add(b);
    }

    function calculateMagicDamage(
        uint256[6] calldata stats,
        uint[7] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(attributes);

        return calculateMagicDamage(stats, attributesStruct);
    }

    function calculatePhysicalDefense(
        uint256[6] calldata stats,
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 strength = stats[uint256(Stats.STRENGTH)];
        uint256 constitution = stats[uint256(Stats.CONSTITUTION)];

        uint256 conMultiplier = markers[0] == Stats.CONSTITUTION
            ? 4
            : markers[1] == Stats.CONSTITUTION
            ? 2
            : 1;

        uint256 strMultiplier = markers[0] == Stats.STRENGTH
            ? 2
            : markers[1] == Stats.STRENGTH
            ? 1
            : 0;

        uint256 a = strength.mul(strMultiplier);
        uint256 b = constitution.mul(conMultiplier);

        return
            ((strength.div(4).add(constitution)).mul(attributes.level))
                .add(a)
                .add(b);
    }

    function calculatePhysicalDefense(
        uint256[6] calldata stats,
        uint[7] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(attributes);

        return calculatePhysicalDefense(stats, attributesStruct);
    }

    function calculateMagicDefense(
        uint256[6] calldata stats,
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 intellect = stats[uint256(Stats.INTELLECT)];
        uint256 constitution = stats[uint256(Stats.CONSTITUTION)];

        uint256 conMultiplier = markers[0] == Stats.CONSTITUTION
            ? 4
            : markers[1] == Stats.CONSTITUTION
            ? 2
            : 1;

        uint256 strMultiplier = markers[0] == Stats.INTELLECT
            ? 2
            : markers[1] == Stats.INTELLECT
            ? 1
            : 0;

        uint256 a = intellect.mul(strMultiplier);
        uint256 b = constitution.mul(conMultiplier);

        return
            ((intellect.div(4).add(constitution)).mul(attributes.level))
                .add(a)
                .add(b);
    }

    function calculateMagicDefense(
        uint256[6] calldata stats,
        uint[7] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(attributes);

        return calculateMagicDefense(stats, attributesStruct);
    }

    function attributesArrToStruct(
        uint[7] calldata attributes
    ) internal pure returns (Attributes memory) {
        Location memory location = Location(attributes[4], attributes[5]);

        return
            Attributes(
                attributes[0],
                attributes[1],
                ClassLibrary.PrimaryClass(attributes[2]),
                ClassLibrary.SecondaryClass(attributes[3]),
                location,
                attributes[6]
            );
    }
}
