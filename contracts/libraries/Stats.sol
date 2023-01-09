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
        uint[6] calldata stats
    ) public pure returns (uint256) {
        uint256 dexterity = stats[uint256(Stats.DEXTERITY)];
        uint256 constitution = stats[uint256(Stats.CONSTITUTION)];

        return dexterity + constitution / 2;
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
        uint256 dexterity = stats[uint256(Stats.DEXTERITY)];

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
        uint256 dexterity = stats[uint256(Stats.DEXTERITY)];

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

        uint256 dexterity = stats[uint256(Stats.DEXTERITY)];
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

    function statsArrToStruct(
        uint[6] memory stats
    ) public pure returns (StatsStruct memory) {
        return
            StatsStruct(
                stats[uint(Stats.STRENGTH)],
                stats[uint(Stats.DEXTERITY)],
                stats[uint(Stats.CONSTITUTION)],
                stats[uint(Stats.INTELLECT)],
                stats[uint(Stats.WIT)],
                stats[uint(Stats.LUCK)]
            );
    }

    function attributesArrToStruct(
        uint[7] calldata attributes
    ) public pure returns (Attributes memory) {
        Location memory location = Location(attributes[4], attributes[5]);

        return
            Attributes(
                attributes[0],
                attributes[1],
                ClassLibrary.PrimaryClass(attributes[2]),
                ClassLibrary.SecondaryClass(attributes[3]),
                location,
                attributes[6] == 1 ? true : false
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
