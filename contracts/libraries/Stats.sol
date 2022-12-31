// SPDX-License-Identifier:MIT
pragma solidity ^0.8.16;
import {ClassLibrary} from "./Class.sol";

library StatsLibrary {
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
        return nextLevel ** 2 * 3 + 100;
    }

    function calculateHealth(
        uint256[6] calldata stats
    ) public pure returns (uint256) {
        uint256 strength = stats[uint256(Stats.STRENGTH)];
        uint256 dexterity = stats[uint256(Stats.DEXTERTY)];
        uint256 constitution = stats[uint256(Stats.CONSTITUTION)];
        uint256 intellect = stats[uint256(Stats.INTELLECT)];
        uint256 wit = stats[uint256(Stats.WIT)];
        uint256 luck = stats[uint256(Stats.LUCK)];

        return
            strength *
            8 +
            dexterity *
            8 +
            constitution *
            20 +
            intellect *
            6 +
            wit *
            6 +
            luck *
            4;
    }

    function calculatePhysicalDamage(
        uint256[6] calldata stats,
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 primaryStatValue = stats[uint256(markers[0])];
        uint256 secondaryStatValue = stats[uint256(markers[1])];

        uint256 strength = stats[uint256(Stats.STRENGTH)];
        uint256 dexterity = stats[uint256(Stats.DEXTERTY)];

        return
            strength *
            10 +
            dexterity *
            8 +
            primaryStatValue *
            4 +
            secondaryStatValue *
            2;
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

        uint256 primaryStatValue = stats[uint256(markers[0])];
        uint256 secondaryStatValue = stats[uint256(markers[1])];

        uint256 intellect = stats[uint256(Stats.INTELLECT)];
        uint256 wit = stats[uint256(Stats.WIT)];

        return
            intellect *
            10 +
            wit *
            8 +
            primaryStatValue *
            4 +
            secondaryStatValue *
            2;
    }

    function calculateMagicDamage(
        uint256[6] calldata stats,
        uint[7] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(attributes);

        return calculateMagicDamage(stats, attributesStruct);
    }

    function calculatePhysicalDefense(
        uint256[6] calldata stats
    ) public pure returns (uint256) {
        uint256 strength = stats[uint256(Stats.STRENGTH)];
        uint256 constitution = stats[uint256(Stats.CONSTITUTION)];
        uint256 dexterity = stats[uint256(Stats.DEXTERTY)];

        return constitution * 8 + strength * 6 + dexterity * 4;
    }

    function calculateMagicDefense(
        uint256[6] calldata stats
    ) public pure returns (uint256) {
        uint256 constitution = stats[uint256(Stats.CONSTITUTION)];
        uint256 intellect = stats[uint256(Stats.INTELLECT)];
        uint256 wit = stats[uint256(Stats.WIT)];

        return intellect * 8 + wit * 6 + constitution * 4;
    }

    function calculatePhysicalCritChance(
        uint256[6] calldata stats,
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 dexComponent = markers[0] == Stats.DEXTERTY
            ? 20
            : markers[1] == Stats.DEXTERTY
            ? 10
            : 5;
        uint256 luckComponent = markers[1] == Stats.LUCK ? 25 : 10;

        uint256 maxCritChance = dexComponent + luckComponent;

        uint256 dexBonus = markers[0] == Stats.DEXTERTY
            ? 5
            : markers[1] == Stats.DEXTERTY
            ? 3
            : 0;
        uint256 luckBonus = markers[1] == Stats.LUCK ? 7 : 0;

        uint256 dexterity = stats[uint256(Stats.DEXTERTY)];
        uint256 luck = stats[uint256(Stats.LUCK)];

        uint256 critChance = (luck / 4 + dexterity / 8) + luckBonus + dexBonus;

        return critChance > maxCritChance ? maxCritChance : critChance;
    }

    function calculatePhysicalCritChance(
        uint256[6] calldata stats,
        uint[7] calldata attributes
    ) public pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(attributes);

        return calculatePhysicalCritChance(stats, attributesStruct);
    }

    function calculateMagicCritChance(
        uint256[6] calldata stats,
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 witComponent = markers[0] == Stats.WIT
            ? 20
            : markers[1] == Stats.WIT
            ? 10
            : 5;
        uint256 luckComponent = markers[1] == Stats.LUCK ? 25 : 10;

        uint256 maxCritChance = witComponent + luckComponent;
        uint256 witBonus = markers[0] == Stats.WIT ? 5 : markers[1] == Stats.WIT
            ? 3
            : 0;
        uint256 luckBonus = markers[1] == Stats.LUCK ? 7 : 0;

        uint256 wit = stats[uint256(Stats.WIT)];
        uint256 luck = stats[uint256(Stats.LUCK)];

        uint256 critChance = (luck / 4 + wit / 8) + luckBonus + witBonus;

        return critChance > maxCritChance ? maxCritChance : critChance;
    }

    function calculateMagicCritChance(
        uint256[6] calldata stats,
        uint[7] calldata attributes
    ) public pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(attributes);

        return calculateMagicCritChance(stats, attributesStruct);
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
