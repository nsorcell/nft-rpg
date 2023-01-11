// SPDX-License-Identifier:MIT
pragma solidity ^0.8.16;
import {ClassLibrary} from "./Class.sol";

library StatsLibrary {
    enum Stats {
        STRENGTH,
        DEXTERITY,
        CONSTITUTION,
        INTELLECT,
        WIT,
        LUCK,
        VOID
    }

    struct StatsStruct {
        uint256 strength;
        uint256 dexterity;
        uint256 constitution;
        uint256 intellect;
        uint256 wit;
        uint256 luck;
    }

    struct Equipment {
        uint256 armor;
        uint256 weapon;
    }

    struct Location {
        uint256 x;
        uint256 y;
    }

    struct Travel {
        bool isTraveling;
        uint256 arrival;
        Location destination;
    }

    struct Attributes {
        uint256 level;
        uint256[6] stats;
        uint256 health;
        uint256 experience;
        ClassLibrary.PrimaryClass primaryClass;
        ClassLibrary.SecondaryClass secondaryClass;
        Location location;
        bool isAlive;
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
        uint256 dexterity = stats[uint256(Stats.DEXTERITY)];
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

    function calculateSpeed(
        Attributes memory attributes
    ) public pure returns (uint256) {
        uint256 dexterity = attributes.stats[uint256(Stats.DEXTERITY)];
        uint256 constitution = attributes.stats[uint256(Stats.CONSTITUTION)];

        return dexterity + constitution / 2;
    }

    function calculatePhysicalDamage(
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 primaryStatValue = attributes.stats[uint256(markers[0])];
        uint256 secondaryStatValue = attributes.stats[uint256(markers[1])];

        uint256 strength = attributes.stats[uint256(Stats.STRENGTH)];
        uint256 dexterity = attributes.stats[uint256(Stats.DEXTERITY)];

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
        uint[8] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(
            attributes,
            stats
        );

        return calculatePhysicalDamage(attributesStruct);
    }

    function calculateMagicDamage(
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 primaryStatValue = attributes.stats[uint256(markers[0])];
        uint256 secondaryStatValue = attributes.stats[uint256(markers[1])];

        uint256 intellect = attributes.stats[uint256(Stats.INTELLECT)];
        uint256 wit = attributes.stats[uint256(Stats.WIT)];

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
        uint[8] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(
            attributes,
            stats
        );

        return calculateMagicDamage(attributesStruct);
    }

    function calculatePhysicalDefense(
        Attributes memory attributes
    ) internal pure returns (uint256) {
        uint256 strength = attributes.stats[uint256(Stats.STRENGTH)];
        uint256 constitution = attributes.stats[uint256(Stats.CONSTITUTION)];
        uint256 dexterity = attributes.stats[uint256(Stats.DEXTERITY)];

        return constitution * 8 + strength * 6 + dexterity * 4;
    }

    function calculatePhysicalDefense(
        uint256[6] calldata stats,
        uint[8] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(
            attributes,
            stats
        );

        return calculatePhysicalDefense(attributesStruct);
    }

    function calculateMagicDefense(
        Attributes memory attributes
    ) internal pure returns (uint256) {
        uint256 constitution = attributes.stats[uint256(Stats.CONSTITUTION)];
        uint256 intellect = attributes.stats[uint256(Stats.INTELLECT)];
        uint256 wit = attributes.stats[uint256(Stats.WIT)];

        return intellect * 8 + wit * 6 + constitution * 4;
    }

    function calculateMagicDefense(
        uint256[6] calldata stats,
        uint[8] calldata attributes
    ) external pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(
            attributes,
            stats
        );

        return calculateMagicDefense(attributesStruct);
    }

    function calculatePhysicalCritChance(
        Attributes memory attributes
    ) internal pure returns (uint256) {
        Stats[2] memory markers = ClassLibrary.getMarkers(
            attributes.primaryClass,
            attributes.secondaryClass
        );

        uint256 dexComponent = markers[0] == Stats.DEXTERITY
            ? 20
            : markers[1] == Stats.DEXTERITY
            ? 10
            : 5;
        uint256 luckComponent = markers[1] == Stats.LUCK ? 25 : 10;

        uint256 maxCritChance = dexComponent + luckComponent;

        uint256 dexBonus = markers[0] == Stats.DEXTERITY
            ? 5
            : markers[1] == Stats.DEXTERITY
            ? 3
            : 0;
        uint256 luckBonus = markers[1] == Stats.LUCK ? 7 : 0;

        uint256 dexterity = attributes.stats[uint256(Stats.DEXTERITY)];
        uint256 luck = attributes.stats[uint256(Stats.LUCK)];

        uint256 critChance = (luck / 4 + dexterity / 8) + luckBonus + dexBonus;

        return critChance > maxCritChance ? maxCritChance : critChance;
    }

    function calculatePhysicalCritChance(
        uint256[6] calldata stats,
        uint[8] calldata attributes
    ) public pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(
            attributes,
            stats
        );

        return calculatePhysicalCritChance(attributesStruct);
    }

    function calculateMagicCritChance(
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

        uint256 wit = attributes.stats[uint256(Stats.WIT)];
        uint256 luck = attributes.stats[uint256(Stats.LUCK)];

        uint256 critChance = (luck / 4 + wit / 8) + luckBonus + witBonus;

        return critChance > maxCritChance ? maxCritChance : critChance;
    }

    function calculateMagicCritChance(
        uint256[6] calldata stats,
        uint[8] calldata attributes
    ) public pure returns (uint256) {
        Attributes memory attributesStruct = attributesArrToStruct(
            attributes,
            stats
        );

        return calculateMagicCritChance(attributesStruct);
    }

    function attributesArrToStruct(
        uint[8] calldata attributes,
        uint[6] calldata stats
    ) public pure returns (Attributes memory) {
        Location memory location = Location(attributes[5], attributes[6]);

        return
            Attributes(
                attributes[0],
                stats,
                attributes[1],
                attributes[2],
                ClassLibrary.PrimaryClass(attributes[3]),
                ClassLibrary.SecondaryClass(attributes[4]),
                location,
                attributes[7] == 1 ? true : false
            );
    }

    function sqrt(uint y) public pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
